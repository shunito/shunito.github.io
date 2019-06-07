var App = (function () {
    'use strict';

    const independent = ['A-c','D','E','I-c','N-n','N-nc','N-pn','N-xs','R','U','V-c'];

    /*
    タグ	対応する BCCWJ 品詞名
    A-c	形容詞-一般
    A-dp	形容詞-非自立可能
    C	接続詞
    D	代名詞
    E	英単語
    F	副詞
    I-c	感動詞-一般
    J-c	形状詞-一般
    J-tari	形状詞-タリ
    J-xs	形状詞-助動詞語幹
    M-aa	補助記号-AA
    M-c	補助記号-一般
    M-cp	補助記号-括弧閉
    M-op	補助記号-括弧開
    M-p	補助記号-句点
    N-n	名詞-名詞的
    N-nc	名詞-普通名詞
    N-pn	名詞-固有名詞
    N-xs	名詞-助動詞語幹
    O	その他
    P	接頭辞
    P-fj	助詞-副助詞
    P-jj	助詞-準体助詞
    P-k	助詞-格助詞
    P-rj	助詞-係助詞
    P-sj	助詞-接続助詞
    Q-a	接尾辞-形容詞的
    Q-j	接尾辞-形状詞的
    Q-n	接尾辞-名詞的
    Q-v	接尾辞-動詞的
    R	連体詞
    S-c	記号-一般
    S-l	記号-文字
    U	URL
    V-c	動詞-一般
    V-dp	動詞-非自立可能
    W	空白
    X	助動詞
    */

    function chunking( tokens ){
        let result = [];
        let chunk = '';
        let beforeType = '';

        tokens.forEach( (elm, index, array) => {
            const token = elm[0];
            const type = elm[1];

            if( independent.includes(type) ){
                if( beforeType === ''){
                    chunk = token;
                }
                else if( beforeType === 'P' ){
                    chunk += token;
                }
                else{
                    result.push( chunk );
                    chunk = token;
                }
            }
            else{
                chunk += token;
            }
            beforeType = type;
        });
        result.push( chunk );

        return result;
    }

    function dispLines() {
        const result = document.getElementById('result');
        const fontSize = document.getElementById('fontsizeSelect').value;
        const wordsByLine = document.getElementById('wordsByLineSelect').value;
        const baseLine = document.getElementById('baseLineSelect').value;
        const addTopValue = fontSize / 100 * baseLine;

        result.style.height = "";
        result.style.fontSize = `${fontSize}px`;

        if( wordsByLine === 'full' ){
            result.style.width = "100%";
        }
        else{
            let stageWidth = Number(fontSize) * Number(wordsByLine);
            result.style.width = `${stageWidth}px`;
        }

        let line, lineWords;
        let topPosition = 0;
        let lines = result.querySelectorAll('p');
        for (line of lines) {
            lineWords = line.querySelectorAll('span');
            for (let elem of lineWords) {
                elem.style.top = `${topPosition}px`;
                topPosition += addTopValue;
            }
        }
        // Ajust Height
        const ajustHeight = result.clientHeight + topPosition - 32;
        result.style.height = `${ajustHeight}px`;
    }

    function index () {

        const btn = document.getElementById('btnShow');
        const textarea = document.getElementById('frText');
        const result = document.getElementById('result');

        const rma = new RakutenMA(model_ja);
        rma.featset = RakutenMA.default_featset_ja;
        rma.hash_func = RakutenMA.create_hash_func(15);

        btn.addEventListener('click', ( event ) => {
            const text = textarea.value;
            const lines = text.split(/\r\n|\r|\n/);

            // remove result.childs
            while (result.firstChild) result.removeChild(result.firstChild);

            // console.log( lines );
            lines.forEach(element => {
                const tokens = rma.tokenize(HanZenKaku.hs2fs(HanZenKaku.hw2fw(HanZenKaku.h2z(element))));
                const chunked = chunking( tokens );
                // console.log( tokens );
                // console.log( chunked );            

                let p = document.createElement('p');
                chunked.forEach( chunk => {
                    let span = document.createElement('span');
                    span.textContent = chunk;
                    p.appendChild(span);
                });            
                result.appendChild(p);
            });

            dispLines();
        });
    }

    return index;

}());
