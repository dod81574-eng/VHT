const API_KEY = "AIzaSyAO6wRItPlm6LKjGMHUpT4Sj6z-ymL4Oy0"; 
const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";

document.getElementById('submitBtn').addEventListener('click', async () => {
    const topic = document.getElementById('topic').value;
    const essay = document.getElementById('essay').value;
    const submitBtn = document.getElementById('submitBtn');
    const loading = document.getElementById('loading');
    const resultDiv = document.getElementById('result');

    if (!essay || essay.trim().length < 10) {
        alert("Vui lòng nhập nội dung bài văn!");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = "Đang kết nối AI...";
    loading.classList.remove('hidden');
    resultDiv.classList.add('hidden');

    const prompt = `Bạn là giáo viên Văn Việt Nam. Hãy chấm điểm (thang 10) và nhận xét bài văn này. 
    Đề bài: ${topic}
    Bài làm: ${essay}
    Yêu cầu trả về duy nhất định dạng JSON như sau: {"score": "điểm số/10", "feedback": "nhận xét chi tiết"}`;

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
            // Nếu v1 vẫn lỗi, thông báo lỗi cụ thể để xử lý
            throw new Error(data.error.message);
        }

        const outputText = data.candidates[0].content.parts[0].text;
        
        // Làm sạch dữ liệu để tránh lỗi parse JSON
        const cleanJson = outputText.replace(/```json|```/g, "").trim();
        const finalResult = JSON.parse(cleanJson);

        document.getElementById('finalScore').innerText = finalResult.score;
        document.getElementById('feedbackContent').innerText = finalResult.feedback;
        resultDiv.classList.remove('hidden');

    } catch (error) {
        console.error("Lỗi:", error);
        alert("Thông báo lỗi: " + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Chấm điểm ngay";
        loading.classList.add('hidden');
    }
});
