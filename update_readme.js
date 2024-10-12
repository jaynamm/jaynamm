import { readFileSync, writeFileSync } from "node:fs";
import Parser from "rss-parser";
 
// 기존 README.md 파일 읽기
const readmePath = "README.md";
let readmeContent = readFileSync(readmePath, "utf8");
 
// RSS 파서 생성
const parser = new Parser({
  headers: {
    Accept: "application/rss+xml, application/xml, text/xml; q=0.1",
  },
});
 
// 최신 블로그 포스트 추가하는 함수
(async () => {
  // RSS 피드 가져오기
  const feed = await parser.parseURL("https://jaynam.tistory.com/rss");
 
  // 최신 5개의 글의 제목과 링크를 추가할 텍스트 생성
  let latestPosts = `

  ✅ Latest Blog Post
  ---
  
  `;

  for (let i = 0; i < 10 && i < feed.items.length; i++) {
    console.log(feed.items[i])
    const { title, link, pubDate} = feed.items[i];

    // 문자열을 Date 객체로 변환
    const dateObj = new Date(pubDate);

    // 날짜를 'YYYY-MM-DD' 형식으로 변환
    const formattedDate = dateObj.toISOString().split('T')[0];

    latestPosts += `- [${formattedDate} - ${title}](${link})\n`;
  }
 
  // 기존 README.md에 최신 블로그 포스트 추가
  const newReadmeContent = readmeContent.includes("✅ Latest Blog Post")
    ? readmeContent.replace(
        /✅ Latest Blog Post[\s\S]*?(?=\n\n## |\n$)/,
        latestPosts
      )
    : readmeContent + latestPosts;
 
  if (newReadmeContent !== readmeContent) {
    writeFileSync(readmePath, newReadmeContent, "utf8");
    console.log("README.md 업데이트 완료");
  } else {
    console.log("새로운 블로그 포스트가 없습니다. README.md 파일이 업데이트되지 않았습니다.");
  }
})();