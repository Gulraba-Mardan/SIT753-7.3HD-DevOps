document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('report-item-form');
    const btnLost = document.getElementById('btn-mode-lost');
    const btnFound = document.getElementById('btn-mode-found');
    const typeInput = document.getElementById('report-type');

    const dateLabel = document.getElementById('date-label');
    const locationHeading = document.getElementById('location-heading');
    const foundCollectionSection = document.getElementById('section-found-collection');

    // Mode function to change between Lost and Found tabs
    function setReportMode(mode) {
        if (mode === 'lost') {
            typeInput.value = 'lost';
            btnLost.classList.add('active');
            btnLost.setAttribute('aria-checked', 'true');
            btnFound.classList.remove('active');
            btnFound.setAttribute('aria-checked', 'false');

            dateLabel.textContent = 'Date Lost';
            locationHeading.textContent = 'Last-Seen Location';
            foundCollectionSection.classList.add('d-none');

        } else {
            typeInput.value = 'found';
            btnFound.classList.add('active');
            btnFound.setAttribute('aria-checked', 'true');
            btnLost.classList.remove('active');
            btnLost.setAttribute('aria-checked', 'false');

            dateLabel.textContent = 'Date Found';
            locationHeading.textContent = 'Discovery Location';
            foundCollectionSection.classList.remove('d-none');
        }
    }

    btnLost.addEventListener('click', () => setReportMode('lost'));
    btnFound.addEventListener('click', () => setReportMode('found'));

    // Set default today's date in date picker
    const dateInput = document.getElementById('item-date');
    if (dateInput && !dateInput.value) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }

    // function to execute on report submission
    if (form) {
       form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const campus = document.getElementById('item-campus').value;
        const building = document.getElementById('item-building').value.trim();
        const room = document.getElementById('item-room').value.trim();

        const reportData = {
            type: typeInput.value,
            title: document.getElementById('item-title').value.trim(),
            category: document.getElementById('item-category').value,
            date: document.getElementById('item-date').value,
            location: [campus, building, room].filter(Boolean).join(' - '),
            description: document.getElementById('item-desc').value.trim()
        };

        console.log('Report submission data:', reportData);

        try {
            const response = await fetch('/api/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reportData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to submit report.');
            }

            alert('Report submitted successfully!');
            form.reset();

            if (dateInput) {
                dateInput.value = new Date().toISOString().split('T')[0];
            }

            setReportMode('lost');

        } catch (error) {
            console.error('Report submission error:', error);
            alert(`Failed to submit report: ${error.message}`);
        }
    });
    }
});