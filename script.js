
const API_KEY = "AIzaSyAHBrAibSm7IjXmqwGytCAOsG_HRDIb48Q"; 
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
document.getElementById('submitBtn').addEventListener('click', async () => {
    const topic = document.getElementById('topic').value;
    const essay = document.getElementById('essay').value;
    const submitBtn = document.getElementById('submitBtn');
    const loading = document.getElementById('loading');
    const resultDiv = document.getElementById('result');

    if (!essay || essay.trim().length < 5) {
        alert("Vui lòng nhập bài văn!");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = "Hệ thống đang chấm...";
    loading.classList.remove('hidden');
    resultDiv.classList.add('hidden');

    const prompt = `Bạn là một giáo viên dạy Văn. Hãy chấm điểm (thang 10) và nhận xét bài văn này. 
    Đề bài: ${topic}
    Bài làm: ${essay}
    Chỉ trả về JSON: {"score": "điểm số/10", "feedback": "nhận xét"}`;

    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        const outputText = data.candidates[0].content.parts[0].text;
        const start = outputText.indexOf('{');
        const end = outputText.lastIndexOf('}') + 1;
        const finalResult = JSON.parse(outputText.substring(start, end));

        document.getElementById('finalScore').innerText = finalResult.score;
        document.getElementById('feedbackContent').innerText = finalResult.feedback;
        resultDiv.classList.remove('hidden');

    } catch (error) {
        alert("Lỗi kết nối: " + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Chấm điểm ngay";
        loading.classList.add('hidden');
    }
});
