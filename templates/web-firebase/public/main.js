document.getElementById('callApi').addEventListener('click', async () => {
    try {
        const res = await fetch('/api/hello');
        const text = await res.text();
        document.getElementById('result').textContent = text;
    } catch (e) {
        document.getElementById('result').textContent = String(e);
    }
});


