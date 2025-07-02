// Simple test to check socket events
console.log('Testing socket connection...');

// Check if the issue is with state management
// Add this to your browser console to test

function testWaitingForDriver() {
    // Simulate the state that should trigger the popup
    console.log('Testing WaitingForDriver popup...');
    
    // Check if element exists
    const waitingElement = document.querySelector('[class*="z-50"]');
    console.log('WaitingForDriver element found:', !!waitingElement);
    
    if (waitingElement) {
        console.log('Element classes:', waitingElement.className);
        console.log('Element transform:', getComputedStyle(waitingElement).transform);
    }
}

// Run this in browser console
testWaitingForDriver();
