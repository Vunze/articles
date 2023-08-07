import requests
from bs4 import BeautifulSoup


class Parser:
    def __init__(self):
        # self.fake_user = UserAgent()
        # self.headers = {
        #         'User-Agent': self.fake_user.chrome
        # }
        self.result = []
        self.url = ""

    def get_page(self, url):
        res = requests.get(url=url)
        return res.text

    def parse_page(self, html: str):
        try:
            soup = BeautifulSoup(html, 'lxml')
        except Exception:
            soup = BeautifulSoup(html, 'html.parser')
        tags_with_dois = soup.select("input[class='section--dois']")
        for tag in tags_with_dois:
            yield tag['value'].split(',')

    def run(self, res_file="dois.txt", links_file='pages.txt'):
        # change this range to control the amount of flats being parsed
        with open(links_file, 'r') as fin:
            counter = 0
            for page in fin:
                counter += 1
                if page:
                    print(f"page {counter} {page}")
                    try:
                        html = self.get_page(page)
                        for dois in self.parse_page(html):
                            for doi in dois:
                                self.result.append(doi + "\n")
                    except Exception as e:
                        print(e)
                        return

        if len(self.result):
            if res_file == "system":
                print(self.result)
                return
            with open(res_file, 'w') as fout:
                fout.writelines(self.result)


if __name__ == '__main__':
    tmp = Parser()
    tmp.run()
