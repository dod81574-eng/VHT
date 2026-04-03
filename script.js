const API_KEY = "AIzaSyAp_075PXhXtVSz_ECWeolVS9ixuPJGlm8"; 
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

document.getElementById('submitBtn').addEventListener('click', async () => {
    const topic = document.getElementById('topic').value;
    const essay = document.getElementById('essay').value;
    const submitBtn = document.getElementById('submitBtn');
    const loading = document.getElementById('loading');
    const resultDiv = document.getElementById('result');

    if (!essay) {
        alert("Vui lòng nhập bài văn!");
        return;
    }

    // Hiển thị trạng thái đang tải
    submitBtn.disabled = true;
    loading.classList.remove('hidden');
    resultDiv.classList.add('hidden');

    const prompt = `
        Bạn là một giáo viên dạy Văn giàu kinh nghiệm. Hãy chấm điểm và nhận xét bài văn sau đây.
        Đề bài (nếu có): ${topic}
        Nội dung bài văn: ${essay}

        Yêu cầu phản hồi theo định dạng JSON như sau:
        {
            "score": "số điểm/10",
            "feedback": "nhận xét chi tiết về ưu điểm, nhược điểm và cách khắc phục"
        }
        Chỉ trả về duy nhất định dạng JSON, không thêm văn bản thừa.
    `;

    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const output = data.candidates[0].content.parts[0].text;
        
        // Trích xuất JSON từ phản hồi của AI (xử lý cả trường hợp AI trả về markdown)
        const cleanJson = output.replace(/```json|```/g, "").trim();
        const finalResult = JSON.parse(cleanJson);

        // Hiển thị kết quả
        document.getElementById('finalScore').innerText = finalResult.score;
        document.getElementById('feedbackContent').innerText = finalResult.feedback;
        resultDiv.classList.remove('hidden');

    } catch (error) {
        console.error("Lỗi:", error);
        alert("Có lỗi xảy ra khi kết nối với AI. Vui lòng kiểm tra lại bài viết hoặc thử lại sau vài giây.");
    } finally {
        submitBtn.disabled = false;
        loading.classList.add('hidden');
    }
});
