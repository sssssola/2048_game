var board = new Array();
var score = 0;

// 全部加载完后运行的主程序
$(document).ready(function () {
    newgame();
});

function newgame() {
    // 初始化棋盘格
    init();
    // 在随机两个格子里生成数字
    generateOneNumber();
    generateOneNumber();
}

function init() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            // 这部分主要是计算每个格子的位置
            var gridCell = $('#grid-cell-' + i + '-' + j);
            gridCell.css('top', getPosTop(i, j));
            gridCell.css('left', getPosLeft(i, j));
        }
    }

    for (var i = 0; i < 4; i++) {
        board[i] = new Array();
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0; // 全部初始化值为0
        }
    }

    // 告诉前端更新初始化的值
    updateBoardView();
}

function updateBoardView() {
    $(".number-cell").remove(); // 先清除之前的number-cell元素
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++) {
            // $("#grid-container").append("<div class="number-cell" id="number-cell-' + i + '-' + j"></div>");
            $("#grid-container").append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
            var theNumberCell = $('#number-cell-' + i + '-' + j);

            // It seems like doesn't work correctly.
            if (board[i][j] == 0) {
                theNumberCell.css('width', '0px');
                theNumberCell.css('height', '0px');
                theNumberCell.css('top', getPosTop(i, j) + 50);
                theNumberCell.css('left', getPosLeft(i, j) + 50);
            } else {
                theNumberCell.css('width', '100px');
                theNumberCell.css('height', '100px');
                theNumberCell.css('top', getPosTop(i, j));
                theNumberCell.css('left', getPosLeft(i, j));
                theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color', getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }
        }
}

function generateOneNumber() {
    if (nospace(board)) {
        return false;
    }
    // 随意一个位置
    // Math.random()生成(0,1)之间的随机浮点数，Math.floor向下取整
    var randx = parseInt(Math.floor(Math.random() * 4));
    var randy = parseInt(Math.floor(Math.random() * 4));
    while (true) {
        if (board[randx][randy] == 0)
            break;
        var randx = parseInt(Math.floor(Math.random() * 4));
        var randy = parseInt(Math.floor(Math.random() * 4));
    }

    // 随意一个数字//2 or 4
    var randNumber = Math.random() < 0.5 ? 2 : 4;

    // 在随机位置显示随机数字
    board[randx][randy] = randNumber;
    // 显示数字时的动画效果
    showNumberWithAnimation(randx, randy, randNumber);
    return true;
}

// js是事件驱动型的语言
$(document).keydown(function (event) {
    switch (event.keyCode) {
        case 37: // left
            if (moveLeft()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            };
            break;
        case 38: // up
            if (moveUp()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            };
            break;
        case 39: // right
            if (moveRight()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            };
            break;
        case 40: // down
            if (moveDown()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            };
            break;
        default:
            break;
    }
})

function isgameover() {
    if (nospace(board) && nomove(board)) {
        gameover();
    }
}

function gameover() {
    alert('gameover!');
}

function nomove(board) {
    if (canMoveDown(board) ||
        canMoveLeft(board) ||
        canMoveUp(board) ||
        canMoveRight(board))
        return false;
    return true;
}

function moveLeft() {
    // 先判断能不能向左移动
    if (!canMoveLeft(board)) {
        return false;
    }

    // moveLeft
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++)
            if (board[i][j] != 0) {
                for (var k = 0; k < j; k++) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
                        // move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board)) {
                        // move 
                        showMoveAnimation(i, j, i, k);
                        // add 叠加操作
                        board[i][k] += board[i][j];
                        board[i][j] = 0;

                        continue;
                    }
                }
            }
    }
    updateBoardView();
    return true;
}

function moveRight() {
    // 先判断能不能向右移动
    if (!canMoveRight(board)) {
        return false;
    }

    // moveRight
    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >= 0; j--)
            if (board[i][j] != 0) {
                for (var k = 3; k > j; k--) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
                        // move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board)) {
                        // move 
                        showMoveAnimation(i, j, i, k);
                        // add 叠加操作
                        board[i][k] *= 2;
                        board[i][j] = 0;

                        continue;
                    }
                }
            }
    }
    updateBoardView();
    return true;
}

// moveUp
function moveUp() {
    // 先判断能不能向上移动
    if (!canMoveUp(board)) {
        return false;
    }

    // moveUp
    for (var j = 0; j < 4; j++) {
        for (var i = 1; i < 4; i++)
            if (board[i][j] != 0) {
                for (var k = 0; k < i; k++) {
                    if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
                        // move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board)) {
                        // move 
                        showMoveAnimation(i, j, k, j);
                        // add 叠加操作
                        board[k][j] *= 2;
                        board[i][j] = 0;

                        continue;
                    }
                }
            }
    }
    updateBoardView();
    return true;
}

// moveDown
function moveDown() {
    // 先判断能不能向下移动
    if (!canMoveDown(board)) {
        return false;
    }

    // moveDown
    for (var j = 0; j < 4; j++) {
        for (var i = 2; i >= 0; i--)
            if (board[i][j] != 0) {
                for (var k = 3; k > i; k--) {
                    if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
                        // move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board)) {
                        // move 
                        showMoveAnimation(i, j, k, j);
                        // add 叠加操作
                        board[k][j] *= 2;
                        board[i][j] = 0;

                        continue;
                    }
                }
            }
    }
    updateBoardView();
    return true;
}

// support.js
function getPosTop(i, j) {
    return 20 + i * 120;
}

function getPosLeft(i, j) {
    return 20 + j * 120;
}

function getNumberBackgroundColor(number) {
    switch (number) {
        case 2: return "#eee4da"; break;
        case 4: return "#ede0c8"; break;
        case 8: return "#f2b179"; break;
        case 16: return "#f59563"; break;
        case 32: return "#f67c5f"; break;
        case 64: return "#f65e3b"; break;
        case 128: return "#edcf72"; break;
        case 256: return "#edcc61"; break;
        case 512: return "#9c0"; break;
        case 1024: return "#33b5e5"; break;
        case 2048: return "#09c"; break;
        case 4096: return "#a6c"; break;
        case 8192: return "#93c"; break;
    }
    return "black";
}

function getNumberColor(number) {
    if (number <= 4)
        return "#776e65";
    return "white";
}

function nospace(board) {
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++)
            if (board[i][j] == 0)
                return false;
    return true;
}

// 判断能否向左移动
function canMoveLeft(board) {
    for (var i = 0; i < 4; i++)
        for (var j = 1; j < 4; j++)
            if (board[i][j] != 0)
                if (board[i][j - 1] == 0 || board[i][j - 1] == board[i][j])
                    return true;

    return false;
}

// 判断能否向上移动
function canMoveUp(board) {
    for (var j = 0; j < 4; j++)
        for (var i = 1; i < 4; i++)
            if (board[i][j] != 0)
                if (board[i - 1][j] == 0 || board[i - 1][j] == board[i][j])
                    return true;

    return false;
}

// 判断能否向下移动
function canMoveDown(board) {
    for (var j = 0; j < 4; j++)
        for (var i = 2; i >= 0; i--)
            if (board[i][j] != 0)
                if (board[i + 1][j] == 0 || board[i + 1][j] == board[i][j])
                    return true;

    return false;
}

// 判断能否向右移动
function canMoveRight(board) {
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 3; j++)
            if (board[i][j] != 0)
                if (board[i][j + 1] == 0 || board[i][j + 1] == board[i][j])
                    return true;
    return false;
}

// 判断中间有无障碍物
function noBlockHorizontal(row, col1, col2, board) {
    for (var i = col1 + 1; i < col2; i++) {
        if (board[row][i] != 0) {
            return false;
        }
    }
    return true;
}

// 判断上下有无障碍物
function noBlockVertical(col, row1, row2, board) {
    for (var i = row1 + 1; i < row2; i++) {
        if (board[i][col] != 0) {
            return false;
        }
    }
    return true;
}

// showanimation.js
function showNumberWithAnimation(i, j, randNumber) {
    var numberCell = $('#number-cell-' + i + "-" + j);
    numberCell.css('background-color', getNumberBackgroundColor(randNumber));
    numberCell.css('color', getNumberColor(randNumber));
    numberCell.text(randNumber);

    numberCell.animate({
        width: "100px",
        height: "100px",
        top: getPosTop(i, j),
        left: getPosLeft(i, j)
    }, 50);
}

function showMoveAnimation(fromx, fromy, tox, toy) {
    var numberCell = $('#number-cell-' + fromx + '-' + fromy);
    numberCell.animate({
        top: getPosTop(tox, toy),
        left: getPosLeft(tox, toy)
    }, 200);
}