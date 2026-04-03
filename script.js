const API_KEY = "AIzaSyA9HgU7oZcG2gHT2lD6vL8WHrk_VrUfNVM"; 
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

document.getElementById('submitBtn').addEventListener('click', async () => {
    const topic = document.getElementById('topic').value;
    const essay = document.getElementById('essay').value;
    const submitBtn = document.getElementById('submitBtn');
    const loading = document.getElementById('loading');
    const resultDiv = document.getElementById('result');

    if (!essay || essay.trim().length < 10) {
        alert("Vui lòng nhập bài văn đầy đủ hơn để AI có thể chấm điểm!");
        return;
    }

    // Hiển thị trạng thái đang xử lý
    submitBtn.disabled = true;
    submitBtn.innerText = "Đang phân tích...";
    loading.classList.remove('hidden');
    resultDiv.classList.add('hidden');

    const prompt = `
        Bạn là một giáo viên dạy Ngữ Văn Việt Nam. Hãy chấm điểm và nhận xét bài văn sau.
        Đề bài: ${topic || "Không có đề bài cụ thể"}
        Nội dung bài văn: ${essay}

        Yêu cầu phản hồi CHỈ bằng định dạng JSON theo cấu trúc sau, không kèm lời dẫn:
        {
            "score": "số điểm/10",
            "feedback": "nhận xét chi tiết về nội dung, diễn đạt và sáng tạo"
        }
    `;

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

        let output = data.candidates[0].content.parts[0].text;
        
        // Làm sạch dữ liệu trả về để tránh lỗi JSON parse
        const cleanJson = output.replace(/```json|```/g, "").trim();
        const finalResult = JSON.parse(cleanJson);

        // Đổ dữ liệu ra màn hình
        document.getElementById('finalScore').innerText = finalResult.score;
        document.getElementById('feedbackContent').innerText = finalResult.feedback;
        resultDiv.classList.remove('hidden');

    } catch (error) {
        console.error("Lỗi:", error);
        alert("Có lỗi: " + error.message + ". Hãy kiểm tra lại API Key hoặc nội dung bài viết.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Chấm điểm ngay";
        loading.classList.add('hidden');
    }
});
