// DÁN API KEY MỚI CỦA BẠN VÀO GIỮA DẤU NGOẶC KÉP DƯỚI ĐÂY
const API_KEY = "AIzaSyA9HgU7oZcG2gHT2lD6vL8WHrk_VrUfNVM"; 
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

document.getElementById('submitBtn').addEventListener('click', async () => {
    const topic = document.getElementById('topic').value;
    const essay = document.getElementById('essay').value;
    const submitBtn = document.getElementById('submitBtn');
    const loading = document.getElementById('loading');
    const resultDiv = document.getElementById('result');

    // Kiểm tra đầu vào cơ bản
    if (!essay || essay.trim().length < 20) {
        alert("Vui lòng nhập bài văn đầy đủ (ít nhất 20 ký tự) để AI có thể chấm điểm!");
        return;
    }

    // Hiển thị trạng thái chờ
    submitBtn.disabled = true;
    submitBtn.innerText = "Đang phân tích dữ liệu...";
    loading.classList.remove('hidden');
    resultDiv.classList.add('hidden');

    // Cấu trúc yêu cầu gửi cho Gemini
    const prompt = `Bạn là một giáo viên dạy Văn. Hãy chấm điểm bài văn sau theo thang điểm 10 và nhận xét chi tiết. 
    Đề bài: ${topic || "Tự chọn"}
    Nội dung bài viết: ${essay}
    
    Yêu cầu trả về kết quả dưới dạng JSON thuần túy (không kèm markdown):
    {
        "score": "số điểm/10",
        "feedback": "nhận xét cụ thể ưu và nhược điểm"
    }`;

    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        // Kiểm tra nếu API trả về lỗi
        if (data.error) {
            if (data.error.message.includes("expired") || data.error.status === "PERMISSION_DENIED") {
                throw new Error("API Key cũ hoặc đã hết hạn. Hãy kiểm tra lại file script.js trên GitHub!");
            }
            throw new Error(data.error.message);
        }

        // Xử lý nội dung trả về từ AI
        let outputText = data.candidates[0].content.parts[0].text;
        
        // Loại bỏ các ký tự thừa nếu AI trả về định dạng ```json ... ```
        const jsonString = outputText.replace(/```json|```/g, "").trim();
        const finalResult = JSON.parse(jsonString);

        // Hiển thị kết quả lên giao diện
        document.getElementById('finalScore').innerText = finalResult.score;
        document.getElementById('feedbackContent').innerText = finalResult.feedback;
        resultDiv.classList.remove('hidden');

    } catch (error) {
        console.error("Lỗi chi tiết:", error);
        alert("Lỗi: " + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Chấm điểm ngay";
        loading.classList.add('hidden');
    }
});
