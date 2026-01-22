/**
 * Main JavaScript - Caleb R. John Personal Site
 */

const WORKER_URL = 'https://email-collector.cajohn0205.workers.dev/subscribe';

document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Red button (close button) navigates to home
    const homeButtons = document.querySelectorAll('.home-btn');
    homeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Navigate to site root
            window.location.href = '/';
        });
    });

    // Yellow button (minimize button) goes back
    const backButtons = document.querySelectorAll('.back-btn');
    backButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            window.history.back();
        });
    });

    // Email form submission
    const form = document.getElementById('email-form');
    if (!form) return;

    const messageDiv = document.getElementById('form-message');
    const emailInput = document.getElementById('email-input');
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        if (!email) return;

        // Update UI to show loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Sending...';
        messageDiv.textContent = '';
        messageDiv.className = 'form-message';

        try {
            const response = await fetch(WORKER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                messageDiv.textContent = '✓ Success! You\'re subscribed.';
                messageDiv.className = 'form-message form-message--success';
                emailInput.value = '';
            } else {
                messageDiv.textContent = data.error || 'Something went wrong. Try again.';
                messageDiv.className = 'form-message form-message--error';
            }
        } catch (error) {
            messageDiv.textContent = 'Network error. Please try again.';
            messageDiv.className = 'form-message form-message--error';
        }

        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bx bx-send"></i> Subscribe';
    });
});

