$("#button01").click(function() {
    /*
     * 讀取資料
     */
    var mydata = [];
    var lines = $("#textarea01").val().split("\n");
    function load_data(lines) {
        if (lines[lines.length-1] === "") {
            lines.pop();
        }
        for (var i in lines) {
            var element = {};
            var index_ = 0;
            var s = lines[i];
            element['id'] = parseInt(i) + 1;
            index_ = 4;
            element['日期'] = s.substring(0, index_);
            s = s.substring(index_);
            index_ = s.search('所') + 1;
            if (index_ === 0) index_ = s.search('隊') + 1;
            element['單位'] = s.substring(0, index_);
            s = s.substring(index_);
            index_ = s.search('，');
            element['人員'] = s.substring(0, index_).split('、');
            s = s.substring(index_);
            index_ = s.search('查獲') + 2;
            s = s.substring(index_);
            index_ = s.search('。');
            element['案類'] = s.substring(0, index_);
            element['備註'] = s.substring(index_ + 1);

            mydata.push(element);
        }
    }
    for (var i in lines) {
        var element = {};
        var index_ = 0;
        var s = lines[i];
        element['id'] = parseInt(i) + 1;
        index_ = 4;
        element['日期'] = s.substring(0, index_);
        s = s.substring(index_);
        index_ = s.search('所') + 1;
        if (index_ === 0) index_ = s.search('隊') + 1;
        element['單位'] = s.substring(0, index_);
        s = s.substring(index_);
        index_ = s.search('，');
        element['人員'] = s.substring(0, index_).split('、');
        s = s.substring(index_);
        index_ = s.search('查獲') + 2;
        s = s.substring(index_);
        index_ = s.search('。');
        element['案類'] = s.substring(0, index_);
        element['備註'] = s.substring(index_ + 1);

        mydata.push(element);
    }
    /*
     * 計算出現次數
     */
    var people_counter = 0;
    var people_list = {};
    for (var d in mydata) {
        for (var p in mydata[d]['人員']) {
            var element = mydata[d]['人員'][p];
            element = get_name(element);
            if (element in people_list) {
                people_list[element]['times']++;
            } else {
                people_counter++;
                people_list[element] = {
                    'order' : people_counter,
                    'times' : 1,
                    'name' : element,
                };
            }
        }
    }
    /*
     * 選出受獎人員
     */
    for (var d in mydata) {
        mydata[d]['times'] = 0;
        mydata[d]['受獎人員排序'] = 99;
        var q;
        for (var p in mydata[d]['人員']) {
            q = mydata[d]['人員'][p];
            q = get_name(q);
            if (people_list[q]['times'] > mydata[d]['times'] || (people_list[q]['times'] === mydata[d]['times'] && people_list[q]['order'] < mydata[d]['受獎人員排序'])) {
                mydata[d]['times'] = people_list[q]['times'];
                mydata[d]['受獎人員排序'] = people_list[q]['order'];
                mydata[d]['受獎人員'] = q;
            }
        }
    }
    for (var d in mydata) {
        var q;
        q = mydata[d]['受獎人員'];
        people_list[q]['win'] = true;
    }
    //console.log(mydata);
    //console.log(JSON.stringify(mydata));
    /*
     * 輸出
     */
    for (var c in mydata) {
        $("#table01").append("<tr>");
        $("#table01 tr:last-child").append("<td>");
        $("#table01 tr:last-child td:last-child").append(mydata[c]['id']);
        $("#table01 tr:last-child").append("<td>");
        $("#table01 tr:last-child td:last-child").append(mydata[c]['日期']);
        $("#table01 tr:last-child").append("<td>");
        $("#table01 tr:last-child td:last-child").append(mydata[c]['單位']);
        $("#table01 tr:last-child").append("<td>");
        $("#table01 tr:last-child td:last-child").append(mydata[c]['人員'].join('、'));
        $("#table01 tr:last-child").append("<td>");
        $("#table01 tr:last-child td:last-child").append(mydata[c]['案類']);
        $("#table01 tr:last-child").append("<td>");
        $("#table01 tr:last-child td:last-child").append(mydata[c]['受獎人員']);
        $("#table01 tr:last-child").append("<td>");
        $("#table01 tr:last-child td:last-child").append(mydata[c]['備註']);
    }
    for (var e in people_list) {
        $("#result01").append(people_list[e]['name'] + " : " + people_list[e]['times']);
        if ('win' in people_list[e]) {
            $("#result01").append("&#x1f448;<br>");
        } else {
            $("#result01").append("<br>");
        }
    }
});
/*
 * 取出姓名
 */
function get_name(string) {
    var s1 = ["小隊長", "偵查佐", "副所長"];
    var s2 = ["所長", "警員", "巡佐", "隊長"];
    var s3 = ["等"];
    if (string.includes(s3[0])) {
        string = string.substring(0, string.search(s3[0]));
    }
    for (var i in s1) {
        if (string.includes(s1[i])) {
            return string.substring(3);
        }
    }
    for (var i in s2) {
        if (string.includes(s2[i])) {
            return string.substring(2);
        }
    }
    return string;
}