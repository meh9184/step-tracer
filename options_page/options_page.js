
$(document).ready(()=>{
    let saveButton = $('#saveButton');

    saveButton.click(()=>{
        let previewMaxSize = $("#previewMaxSize option:selected").val();

        // console.log(previewMaxSize);
        chrome.runtime.sendMessage({
                from: 'option_page',
                action: 'chane-options',
                data: {
                    previewMaxSize: previewMaxSize
                }
            });
    });
});
