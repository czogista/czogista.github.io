// Coffee Supporters Data
// Format: { username: string, coffees: number, comment?: string, customAmount?: string }
// If coffees = 0, customAmount will be displayed instead of coffee emojis
const coffeeSupporters = [
    {
        username: "Maciej",
        coffees: 0,
        customAmount: "12 PLN",
        comment: "Jun 4, 2025"
    }
    // Add more supporters here as they come in
];

// Function to load coffee supporters into the grid
function loadCoffeeSupporters() {
    const thanksGrid = document.getElementById('thanksGrid');
    
    if (!thanksGrid) return;
    
    // Clear existing content
    thanksGrid.innerHTML = '';
    
    // Sort supporters by custom logic: custom amounts first, then by coffee count
    const sortedSupporters = [...coffeeSupporters].sort((a, b) => {
        // If one has custom amount and other doesn't, prioritize custom amount
        if (a.customAmount && !b.customAmount) return -1;
        if (!a.customAmount && b.customAmount) return 1;
        
        // If both have custom amounts, sort alphabetically by custom amount
        if (a.customAmount && b.customAmount) {
            return a.customAmount.localeCompare(b.customAmount);
        }
        
        // If neither has custom amount, sort by coffee count (highest first)
        return b.coffees - a.coffees;
    });
    
    sortedSupporters.forEach(supporter => {
        const supporterItem = document.createElement('div');
        supporterItem.className = 'thanks-item';
        
        let displayAmount;
        
        // Use custom amount if coffees is 0 and customAmount exists
        if (supporter.coffees === 0 && supporter.customAmount) {
            displayAmount = supporter.customAmount;
        } else {
            // Use coffee emoji logic for regular coffee donations
            const coffeeEmoji = supporter.coffees > 1 ? '☕'.repeat(Math.min(supporter.coffees, 5)) : '☕';
            displayAmount = supporter.coffees > 5 ? `☕×${supporter.coffees}` : coffeeEmoji;
        }
        
        supporterItem.innerHTML = `
            <div class="thanks-header">
                <span class="supporter-name">${supporter.username}</span>
                <span class="coffee-count">${displayAmount}</span>
            </div>
            ${supporter.comment ? `<div class="supporter-comment">${supporter.comment}</div>` : ''}
        `;
        
        thanksGrid.appendChild(supporterItem);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadCoffeeSupporters();
});

// Example of adding a new supporter with custom amount
// {
//    username: "GenerosDonor",
//    coffees: 0,                    // Set to 0 to use custom amount
//    customAmount: "50 CZK",        // Custom text displayed instead
//    comment: "Supporting local talent!"
// },
// {
//     username: "RegularSupporter",
//     coffees: 3,                    // Still shows ☕☕☕
//     comment: "Love your work!"
// }