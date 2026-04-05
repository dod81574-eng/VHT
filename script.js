// 1. THAY API KEY CỦA BẠN VÀO ĐÂY
const API_KEY = "AIzaSyCm9WeOHVwIygx80XgFFrlLFDfoV4woqVo"; 

// 2. URL API chính thức của Gemini
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

document.getElementById('submitBtn').addEventListener('click', async () => {
    const topic = document.getElementById('topic').value;
    const essay = document.getElementById('essay').value;
    const submitBtn = document.getElementById('submitBtn');
    const loading = document.getElementById('loading');
    const resultDiv = document.getElementById('result');

    // Kiểm tra đầu vào
    if (!essay || essay.trim().length < 10) {
        alert("Vui lòng nhập nội dung bài văn dài hơn một chút!");
        return;
    }

    // Trạng thái chờ
    submitBtn.disabled = true;
    submitBtn.innerText = "Hệ thống đang chấm...";
    loading.classList.remove('hidden');
    resultDiv.classList.add('hidden');

    // Prompt yêu cầu AI trả về định dạng JSON thuần túy
    const prompt = `Bạn là một giáo viên dạy Văn giàu kinh nghiệm. Hãy chấm điểm bài văn sau.
    Đề bài: ${topic}
    Bài làm: ${essay}
    Yêu cầu: Trả về kết quả dưới dạng JSON duy nhất, không kèm văn bản giải thích. 
    Định dạng JSON: {"score": "điểm/10", "feedback": "nhận xét chi tiết"}`;

    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    response_mime_type: "application/json" // Ép AI trả về JSON chuẩn
                }
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        // Lấy text từ phản hồi của Gemini
        const outputText = data.candidates[0].content.parts[0].text;
        
        // Phân tích JSON (try-catch để tránh lỗi nếu AI trả về chuỗi lạ)
        const finalResult = JSON.parse(outputText);

        // Hiển thị kết quả
        document.getElementById('finalScore').innerText = finalResult.score;
        document.getElementById('feedbackContent').innerText = finalResult.feedback;
        resultDiv.classList.remove('hidden');

    } catch (error) {
        console.error("Lỗi:", error);
        alert("Có lỗi xảy ra: " + error.message);
    } finally {
        // Khôi phục trạng thái nút
        submitBtn.disabled = false;
        submitBtn.innerText = "Chấm điểm ngay";
        loading.classList.add('hidden');
    }
});
