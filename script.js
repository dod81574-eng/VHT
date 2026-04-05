const API_KEY = "AIzaSyCwhdnNgYqyiIBL4YrNTmW6SHBVfevd6Bk"; 
// Cập nhật URL sang model gemini-2.5-flash theo yêu cầu của bạn
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

document.getElementById('submitBtn').addEventListener('click', async () => {
    const topic = document.getElementById('topic').value;
    const essay = document.getElementById('essay').value;
    const submitBtn = document.getElementById('submitBtn');
    const loading = document.getElementById('loading');
    const resultDiv = document.getElementById('result');

    // Kiểm tra đầu vào cơ bản
    if (!essay || essay.trim().length < 10) {
        alert("Nội dung bài văn quá ngắn để chấm điểm!");
        return;
    }

    // Hiệu ứng giao diện khi đang xử lý
    submitBtn.disabled = true;
    submitBtn.innerText = "Hệ thống 2.5 đang chấm...";
    if(loading) loading.classList.remove('hidden');
    if(resultDiv) resultDiv.classList.add('hidden');

    // Prompt tối ưu để AI trả về JSON sạch sẽ
    const prompt = `Bạn là một chuyên gia khảo thí Ngữ văn. Hãy chấm điểm bài văn sau.
    Đề bài: ${topic}
    Bài làm: ${essay}
    Yêu cầu: Trả về duy nhất 1 đối tượng JSON với cấu trúc: {"score": "điểm/10", "feedback": "nhận xét chi tiết"}`;

    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    // Ép kiểu đầu ra là JSON để tránh AI trả về văn bản thừa
                    response_mime_type: "application/json"
                }
            })
        });

        const data = await response.json();

        // Kiểm tra lỗi từ phía Google API
        if (data.error) {
            throw new Error(`Lỗi từ Google: ${data.error.message}`);
        }

        // Trích xuất văn bản JSON từ kết quả của model 2.5
        const outputText = data.candidates[0].content.parts[0].text;
        
        // Chuyển chuỗi văn bản thành Object để hiển thị
        const finalResult = JSON.parse(outputText);

        // Đổ dữ liệu ra giao diện HTML
        document.getElementById('finalScore').innerText = finalResult.score;
        document.getElementById('feedbackContent').innerText = finalResult.feedback;
        
        if(resultDiv) resultDiv.classList.remove('hidden');

    } catch (error) {
        console.error("Chi tiết lỗi:", error);
        alert("Không thể kết nối với Model 2.5: " + error.message);
    } finally {
        // Khôi phục trạng thái nút bấm
        submitBtn.disabled = false;
        submitBtn.innerText = "Chấm điểm ngay";
        if(loading) loading.classList.add('hidden');
    }
});
