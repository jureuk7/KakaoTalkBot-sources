const scriptName = "WeatherInfo.js";

/*
 *   author : HexaL0707
 *   version : 1.0
 */

importPackage(org.jsoup);

const BLANK = "\u200b".repeat(500);

getWeatherInfo = (place) => {
    let doc = Jsoup.connect("https://m.search.naver.com/search.naver?query=" + place + "%20날씨").ignoreContentType(true).referrer("https://www.google.com").userAgent("Dalvik/2.1.0 (Linux; U; Android 8.1.0; LM-X410L Build/OPM1.171019.026) MsgBot/1.0 (debug; 1)").get();
    npl = doc.select("h2.title").text()
    dust_value = doc.select(".figure_result").first().text()
    dust_message = doc.select(".text_info>span").first().text()
    small_dust_value = doc.select(".figure_result").get(1).text()
    small_dust_message = doc.select(".text_info>span").get(1).text()
    sun = doc.select(".figure_result").get(2).text()
    sunMessage = doc.select(".text_info>span").get(2).text()
    water = doc.select(".figure_result").get(3).text()
    waterMessage = doc.select(".text_info>span").get(3).text()
    windyValue = doc.select(".figure_result").get(4).text()
    windyArrow = doc.select(".text_info>span").get(4).text()
    rainPercent = doc.select("div[class=graph_body _horizontal_scroll]").select(".desc_text").first().text()
    rain = doc.select("div[class=graph_body _horizontal_scroll]").select(".rain_base_bar").select(".desc_text").first().text();
    wt_summary = String(doc.select("p.summary").first()).slice(19).slice(0, -4).replace("<br>", " <") + ">";
    maxTemp = doc.select(".up_temperature").text();
    minTemp = doc.select(".down_temperature").text();
    ct = doc.select(".feeling_temperature>strong").text();
    nowTemp = doc.select(".temperature_text>strong").first().text().replace(/[ㄱ-힣]/g, "");

    dailyResponse = "";

    for (var i = 0; i < 6; i++) {
        dailyData = doc.select(".daily_weather_list").select("li").get(i);
        dailyResponse += "\n\n▷  " + String(dailyData.select(".date").text()).slice(0, 2).replace(/[0-9]/g, "") + " (" + String(dailyData.select(".date").select("span").text()).slice(0, -1) + ")"
        dailyResponse += "\n    ▸ 날씨 | " + dailyData.select(".weather_box").text();
        dailyResponse += "\n    ▸ 최고 기온 | " + dailyData.select(".num").first().text();
        dailyResponse += "\n    ▸ 최저 기온 | " + dailyData.select(".num").get(1).text()
    };

    result = "[ " + npl + " 날씨 ]"+BLANK+"\n\n" + wt_summary + "\n\n현재온도 : " + nowTemp + "\n체감온도 : " + ct + "\n▼ 최저기온 : " + minTemp + " | ▲ 최고기온 : " + maxTemp + "\n\n미세먼지 : " + dust_value + " [ " + dust_message + " ]\n초미세먼지 : " + small_dust_value + " [ " + small_dust_message + " ]\n\n자외선 : " + sun + " [ " + sunMessage + " ]\n습도 : " + water + "% [ " + waterMessage + " ]\n\n강수 확률 : " + rainPercent + "%\n강수량 : " + rain + "mm\n\n바람 : " + windyValue + "m/s [ " + windyArrow + " ]\n\n[ 주간 날씨 ]" + dailyResponse;

    return result;
}

function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId) {
    if(msg.startsWith("/날씨 ")){
        try{
            replier.reply(getWeatherInfo(msg.slice(4)));
        } catch (e) {
            replier.reply("날씨정보를 가져오는데 실패하였습니다.\n오타가 없는지 있는 위치인지 확인해주세요");
        }
    }
}
