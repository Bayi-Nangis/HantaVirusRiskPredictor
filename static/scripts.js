const syndromeSelector = document.getElementById('syndrome');
const hpsSymptoms = document.getElementById('hps-features');
const hfrsSymptoms = document.getElementById('hfrs-features');
const triageForm = document.getElementById('triageForm');
const resultCard = document.getElementById('resultCard');

// Syndrome selection, HPS or HFRS, show the relevant symptoms
syndromeSelector.addEventListener('change', function(e){
    if(e.target.value === 'HPS'){
        hpsSymptoms.classList.remove('hidden');
        hfrsSymptoms.classList.add('hidden');
    } else if(e.target.value === 'HFRS'){
        hfrsSymptoms.classList.remove('hidden');
        hpsSymptoms.classList.add('hidden');
    }
});

// Submit button
triageForm.addEventListener('submit', async function(e){
    e.preventDefault();
    const formData = new FormData(triageForm);
    const payload = Object.fromEntries(formData);
    const inputs = triageForm.querySelectorAll('input[type="checkbox"]');
    inputs.forEach(function(el){
        if(el.closest('.hidden')){
            payload[el.name] = 0;
        }
        else{
            if(el.checked === true){
                payload[el.name] = 1;
            }
            else{
                payload[el.name] = 0;
            }
        }
    });
    console.log(payload);
    try {
        // Send form data and wait for the result
        const response = await fetch('/predict', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
        });
        const data = await response.json();
        if(data.success){
            // Display the result
            const status = data.prediction;
            const confidence = data.confidence;
            resultCard.innerHTML = `
            <h3>Prediction: ${status}</h3>
            <p>Confidence: ${confidence}%</p>`;
        }
    }
    catch(error){
        console.error(error);
    }
});