export const parseTransaction = (input, categories) => {
    if (!input) return null;

    const result = {
        amount: '',
        note: '',
        category_id: '',
        type: 'expense' // Default
    };

    const tokens = input.toLowerCase().split(' ');
    let amountFound = false;
    let descriptionTokens = [];

    // Keywords for Income
    const incomeKeywords = ['lương', 'thu', 'tạm ứng', 'thưởng', 'bán', 'nhận'];

    // Check for explicit type keywords
    if (incomeKeywords.some(k => input.toLowerCase().includes(k))) {
        result.type = 'income';
    }

    tokens.forEach(token => {
        // Amount detection (10k, 10m, 50000)
        if (!amountFound) {
            if (/^\d+(k|m)?$/.test(token)) {
                let multiplier = 1;
                if (token.endsWith('k')) multiplier = 1000;
                if (token.endsWith('m')) multiplier = 1000000;

                const rawNum = parseFloat(token.replace(/[km]/g, ''));
                if (!isNaN(rawNum)) {
                    result.amount = rawNum * multiplier;
                    amountFound = true;
                    return;
                }
            }
        }
        descriptionTokens.push(token);
    });

    result.note = descriptionTokens.join(' '); // Use remaining text as note

    // Category Matching (Fuzzy)
    // We look for a category name that is contained within the description
    // OR matches the description closely.
    if (categories && categories.length > 0) {
        // Prioritize income categories if type detected as income
        let potentialCategories = categories;
        if (result.type === 'income') {
            potentialCategories = categories.filter(c => c.type === 'income');
        }

        const bestMatch = potentialCategories.find(c =>
            result.note.toLowerCase().includes(c.name.toLowerCase())
        );

        if (bestMatch) {
            result.category_id = bestMatch.id;
            // Align type with category type if strongly matched
            result.type = bestMatch.type;
        } else if (!result.category_id && !incomeKeywords.some(k => input.toLowerCase().includes(k))) {
            // Fallback: Try expense categories if no match yet
            const expenseMatch = categories.find(c =>
                c.type === 'expense' && result.note.toLowerCase().includes(c.name.toLowerCase())
            );
            if (expenseMatch) {
                result.category_id = expenseMatch.id;
            }
        }
    }

    // Capitalize note for display
    if (result.note) {
        result.note = result.note.charAt(0).toUpperCase() + result.note.slice(1);
    }

    return result;
};
