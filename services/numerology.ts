
const reduceToSingleDigit = (num: number): number => {
    // Master numbers 11, 22, 33 are not reduced further
    if (num === 11 || num === 22 || num === 33) {
        return num;
    }
    
    let sum = num;
    while (sum > 9) {
        sum = String(sum)
            .split('')
            .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
        
        // Check for master numbers during reduction
        if (sum === 11 || sum === 22 || sum === 33) {
            return sum;
        }
    }
    return sum;
};

export const calculateLifePathNumber = (dateString: string): number | null => {
    if (!dateString) return null;

    try {
        const [year, month, day] = dateString.split('-').map(Number);

        if (isNaN(year) || isNaN(month) || isNaN(day)) {
            return null;
        }

        const reducedYear = reduceToSingleDigit(year);
        const reducedMonth = reduceToSingleDigit(month);
        const reducedDay = reduceToSingleDigit(day);

        const totalSum = reducedYear + reducedMonth + reducedDay;

        return reduceToSingleDigit(totalSum);

    } catch (error) {
        console.error("Error calculating life path number:", error);
        return null;
    }
};
