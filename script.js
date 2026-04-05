const API_KEY = "AIzaSyDIbee-IyB9kPONMkaELxjjF6-63DFUS58"; // Nhớ kiểm tra xem Key này còn sống không nhé
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

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

    // Cấu trúc prompt để ép AI trả về JSON sạch
    const prompt = `Bạn là giáo viên Văn. Chấm điểm bài văn sau. 
    Đề: ${topic}
    Bài: ${essay}
    Trả về định dạng JSON duy nhất: {"score": "điểm/10", "feedback": "nhận xét"}`;

    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    // Thêm dòng này để AI hiểu là phải xuất ra JSON chuẩn
                    response_mime_type: "application/json"
                }
            })
        });

        const data = await response.json();

        if (data.error) {
            // Nếu vẫn lỗi, hiện thông báo chi tiết để debug
            throw new Error(data.error.message);
        }

        const outputText = data.candidates[0].content.parts[0].text;
        const finalResult = JSON.parse(outputText);

        document.getElementById('finalScore').innerText = finalResult.score;
        document.getElementById('feedbackContent').innerText = finalResult.feedback;
        resultDiv.classList.remove('hidden');

    } catch (error) {
        console.error(error);
        alert("Lỗi: " + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Chấm điểm ngay";
        loading.classList.add('hidden');
    }
});
