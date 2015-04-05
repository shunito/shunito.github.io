// Kana to Braille
// Copyright 2014 Shunsuke Ito
// 分かち書きされたよみがなをブライユ式点字（Unicode）に変換
// http://ja.wikipedia.org/wiki/%E7%82%B9%E5%AD%97
//
// Licensed under the Apache License, Version 2.0 (the "License");
// http://www.apache.org/licenses/LICENSE-2.0

(function(definition) {
    // CommonJS
    if (typeof exports === "object") {
        module.exports = definition();
        // RequireJS
    } else if (typeof define === "function" && define.amd) {
        define(definition);
        // <script>
    } else {
        Braille = definition();
    }
})(function() {
    'use strict';
    var Braille = function Braille() {};
    var charlist = [];
    // 拗音 （拗音符 '&#x2808;'）
    // 拗音などは複数文字置換のため行列の先頭において先に処理する
    // TODO: 開拗音・合拗音など
    charlist.push([/きゃ/g, '&#x2808;' + '&#x2821;']);
    charlist.push([/きゅ/g, '&#x2808;' + '&#x2829;']);
    charlist.push([/きょ/g, '&#x2808;' + '&#x282a;']);
    charlist.push([/しゃ/g, '&#x2808;' + '&#x2831;']);
    charlist.push([/しゅ/g, '&#x2808;' + '&#x2839;']);
    charlist.push([/しょ/g, '&#x2808;' + '&#x283a;']);
    charlist.push([/ちゃ/g, '&#x2808;' + '&#x2815;']);
    charlist.push([/ちゅ/g, '&#x2808;' + '&#x281d;']);
    charlist.push([/ちょ/g, '&#x2808;' + '&#x281e;']);
    charlist.push([/にゃ/g, '&#x2808;' + '&#x2805;']);
    charlist.push([/にゅ/g, '&#x2808;' + '&#x280d;']);
    charlist.push([/にょ/g, '&#x2808;' + '&#x280e;']);
    charlist.push([/ひゃ/g, '&#x2808;' + '&#x2825;']);
    charlist.push([/ひゅ/g, '&#x2808;' + '&#x282d;']);
    charlist.push([/ひょ/g, '&#x2808;' + '&#x282e;']);
    charlist.push([/みゃ/g, '&#x2808;' + '&#x2835;']);
    charlist.push([/みゅ/g, '&#x2808;' + '&#x283d;']);
    charlist.push([/みょ/g, '&#x2808;' + '&#x283e;']);
    charlist.push([/りゃ/g, '&#x2808;' + '&#x2811;']);
    charlist.push([/りゅ/g, '&#x2808;' + '&#x2819;']);
    charlist.push([/りょ/g, '&#x2808;' + '&#x281a;']);
    // 濁音＋拗音　（濁音符と拗音符：'&#x2818;'）
    charlist.push([/ぎゃ/g, '&#x2818;' + '&#x2821;']);
    charlist.push([/ぎゅ/g, '&#x2818;' + '&#x2829;']);
    charlist.push([/ぎょ/g, '&#x2818;' + '&#x282a;']);
    charlist.push([/じゃ/g, '&#x2818;' + '&#x2831;']);
    charlist.push([/じゅ/g, '&#x2818;' + '&#x2839;']);
    charlist.push([/じょ/g, '&#x2818;' + '&#x283a;']);
    charlist.push([/ぢゃ/g, '&#x2818;' + '&#x2815;']);
    charlist.push([/ぢゅ/g, '&#x2818;' + '&#x281d;']);
    charlist.push([/ぢょ/g, '&#x2818;' + '&#x281e;']);
    charlist.push([/びゃ/g, '&#x2818;' + '&#x2825;']);
    charlist.push([/びゅ/g, '&#x2818;' + '&#x282d;']);
    charlist.push([/びょ/g, '&#x2818;' + '&#x282e;']);
    // 半濁音+拗音　（半濁音符と拗音符：'&#x2828;'）
    charlist.push([/ぴゃ/g, '&#x2828;' + '&#x2825;']);
    charlist.push([/ぴゅ/g, '&#x2828;' + '&#x282d;']);
    charlist.push([/ぴょ/g, '&#x2828;' + '&#x282e;']);
    // 濁音　（濁音符　'&#x2810;'）
    charlist.push([/が/g, '&#x2810;' + '&#x2821;']);
    charlist.push([/ぎ/g, '&#x2810;' + '&#x2823;']);
    charlist.push([/ぐ/g, '&#x2810;' + '&#x2829;']);
    charlist.push([/げ/g, '&#x2810;' + '&#x282b;']);
    charlist.push([/ご/g, '&#x2810;' + '&#x282a;']);
    charlist.push([/ざ/g, '&#x2810;' + '&#x2831;']);
    charlist.push([/じ/g, '&#x2810;' + '&#x2833;']);
    charlist.push([/ず/g, '&#x2810;' + '&#x2839;']);
    charlist.push([/ぜ/g, '&#x2810;' + '&#x283b;']);
    charlist.push([/ぞ/g, '&#x2810;' + '&#x283a;']);
    charlist.push([/だ/g, '&#x2810;' + '&#x2815;']);
    charlist.push([/ぢ/g, '&#x2810;' + '&#x2817;']);
    charlist.push([/づ/g, '&#x2810;' + '&#x281d;']);
    charlist.push([/で/g, '&#x2810;' + '&#x281f;']);
    charlist.push([/ど/g, '&#x2810;' + '&#x281e;']);
    charlist.push([/ば/g, '&#x2810;' + '&#x2825;']);
    charlist.push([/び/g, '&#x2810;' + '&#x2827;']);
    charlist.push([/ぶ/g, '&#x2810;' + '&#x282d;']);
    charlist.push([/べ/g, '&#x2810;' + '&#x282f;']);
    charlist.push([/ぼ/g, '&#x2810;' + '&#x282e;']);
    // 半濁音　（半濁音符：'&#x2820;'）
    charlist.push([/ぱ/g, '&#x2820;' + '&#x2825;']);
    charlist.push([/ぴ/g, '&#x2820;' + '&#x2827;']);
    charlist.push([/ぷ/g, '&#x2820;' + '&#x282d;']);
    charlist.push([/ぺ/g, '&#x2820;' + '&#x282f;']);
    charlist.push([/ぽ/g, '&#x2820;' + '&#x282e;']);
    // 記号・促音符など
    charlist.push([/　/g, '&#x2800;']);
    charlist.push([/ /g, '&#x2800;']);
    charlist.push([/ん/g, '&#x2834;']);
    charlist.push([/っ/g, '&#x2802;']);
    charlist.push([/ー/g, '&#x2812;']);
    charlist.push([/、/g, '&#x2830;' + '&#x2800;']);
    charlist.push([/。/g, '&#x2832;' + '&#x2800;' + '&#x2800;']);
    charlist.push([/〜/g, '&#x2824;' + '&#x2824;']);
    charlist.push([/[「」]/g, '&#x2824;']);
    charlist.push([/[()（）]/g, '&#x2836;']);
    charlist.push([/[\?？]/g, '&#x2822;']);
    charlist.push([/[!！]/g, '&#x2816;']);
    charlist.push([/・/g, '&#x2810;' + '&#x2800;']);
    charlist.push([/\./g, '&#x2802;']);
    //charlist.push([/,/g, '&#x2804;']);
 
    // 五十音
    charlist.push([/あ/g, '&#x2801;']);
    charlist.push([/い/g, '&#x2803;']);
    charlist.push([/う/g, '&#x2809;']);
    charlist.push([/え/g, '&#x280b;']);
    charlist.push([/お/g, '&#x280a;']);
    charlist.push([/か/g, '&#x2821;']);
    charlist.push([/き/g, '&#x2823;']);
    charlist.push([/く/g, '&#x2829;']);
    charlist.push([/け/g, '&#x282b;']);
    charlist.push([/こ/g, '&#x282a;']);
    charlist.push([/さ/g, '&#x2831;']);
    charlist.push([/し/g, '&#x2833;']);
    charlist.push([/す/g, '&#x2839;']);
    charlist.push([/せ/g, '&#x283b;']);
    charlist.push([/そ/g, '&#x283a;']);
    charlist.push([/た/g, '&#x2815;']);
    charlist.push([/ち/g, '&#x2817;']);
    charlist.push([/つ/g, '&#x281d;']);
    charlist.push([/て/g, '&#x281f;']);
    charlist.push([/と/g, '&#x281e;']);
    charlist.push([/な/g, '&#x2805;']);
    charlist.push([/に/g, '&#x2807;']);
    charlist.push([/ぬ/g, '&#x280d;']);
    charlist.push([/ね/g, '&#x280f;']);
    charlist.push([/の/g, '&#x280e;']);
    charlist.push([/は/g, '&#x2825;']);
    charlist.push([/ひ/g, '&#x2827;']);
    charlist.push([/ふ/g, '&#x282d;']);
    charlist.push([/へ/g, '&#x282f;']);
    charlist.push([/ほ/g, '&#x282e;']);
    charlist.push([/ま/g, '&#x2835;']);
    charlist.push([/み/g, '&#x2837;']);
    charlist.push([/む/g, '&#x283d;']);
    charlist.push([/め/g, '&#x283f;']);
    charlist.push([/も/g, '&#x283e;']);
    charlist.push([/や/g, '&#x280c;']);
    charlist.push([/ゆ/g, '&#x282c;']);
    charlist.push([/よ/g, '&#x281c;']);
    charlist.push([/ら/g, '&#x2811;']);
    charlist.push([/り/g, '&#x2813;']);
    charlist.push([/る/g, '&#x2819;']);
    charlist.push([/れ/g, '&#x281b;']);
    charlist.push([/ろ/g, '&#x281a;']);
    charlist.push([/わ/g, '&#x2804;']);
    charlist.push([/ゐ/g, '&#x2806;']);
    charlist.push([/ゑ/g, '&#x2816;']);
    charlist.push([/を/g, '&#x2814;']);
    Braille.toBraille = function(str) {
        var i, l, c, t, fAlf, fNum, str2 = '';
        if (typeof(str) !== 'string') {
            return null;
        }
        // 数字とアルファベット変換
        // TODO: 一続きの語中で英語→日本語と変化する場合には、その間に第一つなぎ符を挿入
        fAlf = fNum = false;
        for (i = 0, l = str.length; i < l; i++) {
            c = str.substr(i, 1);
            t = '';
            // 外字引用符が必要かどうか　（外字引用符 '&#x2826;'）
            // とりあえずアルファベット連続は全て外字引用符で挟む
            // TODO: 一文字の場合外字符のみにする
            if (c.match(/[a-zA-Z]/)) {
                if (fAlf === false) {
                    str2 += '&#x2826;';
                    fAlf = true;
                }
                // 大文字符（外字引用符 '&#x2820;'）
                // TODO: 二重大文字符の対応
                if (c.match(/[A-Z]/)) {
                    str2 += '&#x2820;';
                }
            } else {
                // 外字引用符を閉じてクリア
                if (fAlf === true) {
                    str2 += '&#x2834;';
                    fAlf = false;
                }
            }
            // 数符が必要かどうか　（数符 '&#x283c;'）
            // 数字の連続に数符はひとつ
            if (c.match(/[0-9]/)) {
                if (fNum === false) {
                    str2 += '&#x283c;'
                    fNum = true;
                }
            } else {
                fNum = false;
            }
            switch (c.toLowerCase()) {
            case '0':
                str2 += '&#x281a;';
                break;
            case '1':
                str2 += '&#x2801;';
                break;
            case '2':
                str2 += '&#x2803;';
                break;
            case '3':
                str2 += '&#x2809;';
                break;
            case '4':
                str2 += '&#x2819;';
                break;
            case '5':
                str2 += '&#x2811;';
                break;
            case '6':
                str2 += '&#x280b;';
                break;
            case '7':
                str2 += '&#x281b;';
                break;
            case '8':
                str2 += '&#x2813;';
                break;
            case '9':
                str2 += '&#x280a;';
                break;
            case 'a':
                str2 += '&#x2801;';
                break;
            case 'b':
                str2 += '&#x2803;';
                break;
            case 'c':
                str2 += '&#x2809;';
                break;
            case 'd':
                str2 += '&#x2819;';
                break;
            case 'e':
                str2 += '&#x2811;';
                break;
            case 'f':
                str2 += '&#x280b;';
                break;
            case 'g':
                str2 += '&#x281b;';
                break;
            case 'h':
                str2 += '&#x2813;';
                break;
            case 'i':
                str2 += '&#x280a;';
                break;
            case 'j':
                str2 += '&#x281a;';
                break;
            case 'k':
                str2 += '&#x2805;';
                break;
            case 'l':
                str2 += '&#x2807;';
                break;
            case 'm':
                str2 += '&#x280d;';
                break;
            case 'n':
                str2 += '&#x281d;';
                break;
            case 'o':
                str2 += '&#x2815;';
                break;
            case 'p':
                str2 += '&#x280f;';
                break;
            case 'q':
                str2 += '&#x281f;';
                break;
            case 'r':
                str2 += '&#x2817;';
                break;
            case 's':
                str2 += '&#x280e;';
                break;
            case 't':
                str2 += '&#x281e;';
                break;
            case 'u':
                str2 += '&#x2825;';
                break;
            case 'v':
                str2 += '&#x2827;';
                break;
            case 'w':
                str2 += '&#x283a;';
                break;
            case 'x':
                str2 += '&#x282d;';
                break;
            case 'y':
                str2 += '&#x283d;';
                break;
            case 'z':
                str2 += '&#x2835;';
                break;
            default:
                // 数字とアルファベット以外はそのまま
                str2 += c;
            }
        }
        // 外字引用符が閉じられていない場合閉じる
        if (fAlf === true) {
            str2 += '&#x2834;';
        }
        str = str2;
        // 文字列変換
        for (i = 0, l = charlist.length; i < l; i++) {
            t = charlist[i][0];
            c = charlist[i][1];
            str = str.replace(t, c);
        }
        return str;
    };

    Braille.toKana = function(str) {
        var i, l, c, t, fAlf, fNum, fUpper, str2 = '';
        var codes = [];
        var re;
        if (typeof(str) !== 'string') {
            return null;
        }
        console.log(str);
        codes = str.split(';');
        fAlf = fNum = fUpper = false;
        for (i = 0, l = codes.length; i < l; i++) {
            c = codes[i] + ';';
            // 文字列の終わり
            if (c === ';') {
                break;
            }
            // 数符
            if (c === '&#x283c;') {
                fNum = true;
                continue;
            }
            // 外字引用符
            if (c === '&#x2826;') {
                fAlf = true;
                continue;
            }
            // 大文字符
            if (c === '&#x2820;') {
                fUpper = true;
                continue;
            }
            if (fAlf) {
                switch (c) {
                case '&#x2834;':
                    // 外字引用符閉じ
                    fAlf = false;
                    fUpper = false;
                    break;
                case '&#x2801;':
                    str2 += 'a';
                    break;
                case '&#x2803;':
                    str2 += 'b';
                    break;
                case '&#x2809;':
                    str2 += 'c';
                    break;
                case '&#x2819;':
                    str2 += 'd';
                    break;
                case '&#x2811;':
                    str2 += 'e';
                    break;
                case '&#x280b;':
                    str2 += 'f';
                    break;
                case '&#x281b;':
                    str2 += 'g';
                    break;
                case '&#x2813;':
                    str2 += 'h';
                    break;
                case '&#x280a;':
                    str2 += 'i';
                    break;
                case '&#x281a;':
                    str2 += 'j';
                    break;
                case '&#x2805;':
                    str2 += 'k';
                    break;
                case '&#x2807;':
                    str2 += 'l';
                    break;
                case '&#x280d;':
                    str2 += 'm';
                    break;
                case '&#x281d;':
                    str2 += 'n';
                    break;
                case '&#x2815;':
                    str2 += 'o';
                    break;
                case '&#x280f;':
                    str2 += 'p';
                    break;
                case '&#x281f;':
                    str2 += 'q';
                    break;
                case '&#x2817;':
                    str2 += 'r';
                    break;
                case '&#x280e;':
                    str2 += 's';
                    break;
                case '&#x281e;':
                    str2 += 't';
                    break;
                case '&#x2825;':
                    str2 += 'u';
                    break;
                case '&#x2827;':
                    str2 += 'v';
                    break;
                case '&#x283a;':
                    str2 += 'w';
                    break;
                case '&#x282d;':
                    str2 += 'x';
                    break;
                case '&#x283d;':
                    str2 += 'y';
                    break;
                case '&#x2835;':
                    str2 += 'z';
                    break;
                default:
                    // 数字とアルファベット以外はそのまま
                    str2 += c;
                    fAlf = false;
                    fUpper = false;
                }
                if (fUpper) {
                    // TODO: 結合前にちゃんと大文字にする
                    c = str2.substr(-1, 1).toUpperCase();
                    str2 = str2.substr(0, str2.length - 1) + c;
                }
            } else if (fNum) {
                switch (c) {
                case '&#x281a;':
                    str2 += '0';
                    break;
                case '&#x2801;':
                    str2 += '1';
                    break;
                case '&#x2803;':
                    str2 += '2';
                    break;
                case '&#x2809;':
                    str2 += '3';
                    break;
                case '&#x2819;':
                    str2 += '4';
                    break;
                case '&#x2811;':
                    str2 += '5';
                    break;
                case '&#x280b;':
                    str2 += '6';
                    break;
                case '&#x281b;':
                    str2 += '7';
                    break;
                case '&#x2813;':
                    str2 += '8';
                    break;
                case '&#x280a;':
                    str2 += '9';
                    break;
                default:
                    // 数字とアルファベット以外はそのまま
                    str2 += c;
                    fNum = false;
                }
            } else {
                str2 += c;
            }
        }
        str = str2;
        for (i = 0, l = charlist.length; i < l; i++) {
            t = charlist[i][0];
            c = charlist[i][1];
            t = t.toString().replace("/g", "").replace("/", "");
            re = new RegExp(c,"g");            
            str = str.replace(re, t);
        }
        return str;
    };
    // モジュールのエクスポート
    return Braille;
});