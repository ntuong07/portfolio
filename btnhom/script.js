$(document).ready(function() {
    $('#submitBtn').click(function() {
        // Biến lưu trữ điểm số các lựa chọn
        let scores = { A: 0, B: 0, C: 0, D: 0 };
        let answeredCount = 0;

        // Lặp qua mỗi câu hỏi để tính điểm
        $('.question').each(function() {
            let selectedValue = $(this).find('input[type="radio"]:checked').val();
            if (selectedValue) {
                scores[selectedValue]++;
                answeredCount++;
            }
        });

        // Kiểm tra xem đã trả lời đủ 10 câu chưa
        if (answeredCount < 10) {
            alert("Bạn vui lòng hoàn thành đủ 10 câu hỏi trước khi xem kết quả nhé!");
            return; 
        }

        // Tìm đáp án được chọn nhiều nhất
        let maxScore = 0;
        let maxType = '';
        for (let key in scores) {
            if (scores[key] > maxScore) {
                maxScore = scores[key];
                maxType = key;
            }
        }

        // Dữ liệu kết quả dựa trên các nhóm
        const resultData = {
            A: {
                title: "Bạn là hệ ngôn ngữ PYTHON",
                text: "Trọng tâm của bạn là Data Science và AI. Bạn thích sự ngắn gọn, rõ ràng và hiệu quả. Các thư viện khủng của Python chính là bảo bối của bạn!",
                img: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg"
            },
            B: {
                title: "Bạn là hệ ngôn ngữ C++",
                text: "Bạn sinh ra để trị hệ thống, kiến trúc máy tính và Game Development. Cấu trúc phức tạp, con trỏ và hiệu năng tuyệt đối là đam mê của bạn.",
                img: "https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg"
            },
            C: {
                title: "Bạn là hệ ngôn ngữ JAVASCRIPT",
                text: "Bạn chính là linh hồn của Web Development! Năng động, linh hoạt và luôn biết cách tương tác tạo ra những giao diện tuyệt vời nhất.",
                img: "https://upload.wikimedia.org/wikipedia/commons/9/99/Unofficial_JavaScript_logo_2.svg"
            },
            D: {
                title: "Bạn là hệ lập trình ASSEMBLY",
                text: "Bạn là một 'hacker' thực thụ thích can thiệp sâu xuống phần cứng, chip và thanh ghi. Sự tỉ mỉ và logic của bạn thật đáng nể!",
                img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Osi_standard_symbol.png/120px-Osi_standard_symbol.png"
            }
        };

        // Ứng dụng jQuery Animation để hiển thị
        // 1. Trượt ẩn các câu hỏi (slideUp)
        $('#quiz-container').slideUp(800, function() {
            // 2. Thay đổi nội dung kết quả
            $('#result-title').text(resultData[maxType].title);
            $('#result-text').text(resultData[maxType].text);
            $('#result-img').attr('src', resultData[maxType].img);

            // 3. Hiện vùng kết quả bằng hiệu ứng mờ dần (fadeIn) và phóng to nhẹ chữ (animate)
            $('#result-container')
                .fadeIn(1000)
                .css({fontSize: '0.9em'})
                .animate({fontSize: '1.2em'}, 500);
        });
    });
});
