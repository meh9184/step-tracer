
$(document).ready(()=>{
    let saveButton = $('#saveButton');

    saveButton.click(()=>{
        let previewMaxSize = $("#previewMaxSize option:selected").val();

        // console.log(previewMaxSize);
        chrome.runtime.sendMessage({
                from: 'option_page',
                action: 'change-options',
                data: {
                    previewMaxSize: previewMaxSize
                }
        });

        let msg = `"${previewMaxSize}" (으)로 설정 완료했습니다.`;
        if(previewMaxSize === "999"){
            msg =  '"제한 없음"으로 설정 완료했습니다.';
        }

        alert(msg);
    });
});
