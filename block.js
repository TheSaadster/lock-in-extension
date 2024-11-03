        // Motivational quotes
        const quotes = [
            { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
            { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { text: "Don't count the days, make the days count.", author: "Muhammad Ali" },
            { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
            { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
            { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
            { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
            { text: "Done is better than perfect.", author: "Sheryl Sandberg" }
        ];

        // Productive suggestions
        const suggestions = [
            "Take a 5-minute meditation break",
            "Do 10 push-ups",
            "Write down your top 3 goals for today",
            "Drink a glass of water",
            "Organize your desk",
            "Write in your journal",
            "Practice deep breathing for 1 minute",
            "Review your to-do list"
        ];

        // Display random quote
        function updateQuote() {
            const quoteObj = quotes[Math.floor(Math.random() * quotes.length)];
            document.getElementById('quote').textContent = quoteObj.text;
            document.getElementById('author').textContent = `- ${quoteObj.author}`;
        }

        // Display random suggestions
        function updateSuggestions() {
            const shuffled = suggestions.sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 3);
            const suggestionList = document.getElementById('suggestions');
            suggestionList.innerHTML = selected.map(s => `<li>${s}</li>`).join('');
        }

        // Update timer
        function updateTimer() {
            const now = new Date();
            chrome.storage.sync.get(['endHour'], (result) => {
                const endHour = result.endHour || 17;
                const end = new Date();
                end.setHours(endHour, 0, 0, 0);
                
                if (now >= end) {
                    end.setDate(end.getDate() + 1);
                }
                
                const diff = end - now;
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                
                document.getElementById('timer').textContent = 
                    `${hours}h ${minutes}m ${seconds}s until this site is unblocked`;
            });
        }

        // Initialize everything
        document.addEventListener('DOMContentLoaded', () => {
            // Initial updates
            updateQuote();
            updateSuggestions();
            updateTimer();
            // Set intervals for updates
            setInterval(updateQuote, 30000);     // New quote every 30 seconds
            setInterval(updateSuggestions, 60000); // New suggestions every minute
            setInterval(updateTimer, 1000);       // Update timer every second
        });