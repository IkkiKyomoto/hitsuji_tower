let colorIntensityA = 0; // 色の濃度 (A)
let colorIntensityD = 0; // 色の濃度（D）
let colorIntensityUP = 0; // 色の濃度（スペース）

document.addEventListener('keydown', function(event) {
    if (event.keyCode === 65 || event.keyCode === 37) { // 'A','←'キーが押された場合
        colorIntensityA -= 1; // 色の濃度を減少させる
        updateBackgroundColor(); // 背景色を更新する関数を呼び出す
    }
    if (event.keyCode === 32 || event.keyCode === 87 || event.keyCode === 38) { 
        // 'スペース','w','↑'キーが押された場合
        colorIntensityUP += 0.005; // 色の濃度を増やす
        updateBackgroundColor(); // 背景色を更新する関数を呼び出す
    }
    if (event.keyCode === 68 || event.keyCode === 39) { // 'D','→'キーが押された場合
        colorIntensityD += 1; // 色の濃度を増やす
        updateBackgroundColor(); // 背景色を更新する関数を呼び出す
    }
});

function updateBackgroundColor() {
    // 色の濃度が255を超えた場合、255に制限する
    colorIntensityA = Math.min(colorIntensityA, 255);
    colorIntensityA = Math.max(colorIntensityA, 0);
    colorIntensityD = Math.min(colorIntensityD, 255);
    colorIntensityD = Math.max(colorIntensityD, 0);
    colorIntensityUP = Math.min(colorIntensityUP, 255);
    colorIntensityUP = Math.max(colorIntensityUP, 0);
    // 背景色を設定
    document.body.style.backgroundColor = `rgb(${colorIntensityUP}, ${colorIntensityA}, ${colorIntensityD})`;
}

