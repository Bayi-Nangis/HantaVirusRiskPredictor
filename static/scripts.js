const syndromeSelector = document.getElementById('syndrome');
const hpsSymptoms = document.getElementById('hps-features');
const hfrsSymptoms = document.getElementById('hfrs-features');
const triageForm = document.getElementById('triageForm');
const resultCard = document.getElementById('resultCard');

syndromeSelector.addEventListener('change', function(e){
    if(e.target.value === 'HPS'){
        hpsSymptoms.classList.remove('hidden');
        hfrsSymptoms.classList.add('hidden');
    } else if(e.target.value === 'HFRS'){
        hfrsSymptoms.classList.remove('hidden');
        hpsSymptoms.classList.add('hidden');
    }
});

triageForm.addEventListener('submit', function(e){
    e.preventDefault();
    const formData = new FormData(triageForm);
    const payload = Object.fromEntries(formData);
    const inputs = triageForm.querySelectorAll('input[type="checkbox"]');
    inputs.forEach(function(e){
        if(e.closest('.hidden')){
            payload[e.name] = 0;
        }
        else{
            if(e.checked === true){
                payload[e.name] = 1;
            }
            else{
                payload[e.name] = 0;
            }
        }
    });
    console.log(payload);
});

