import requests
from bs4 import BeautifulSoup
import arxiv
import json

class NIPSParser:
    def __init__(self):
        # self.fake_user = UserAgent()
        # self.headers = {
        #         'User-Agent': self.fake_user.chrome
        # }
        self.result = []
        self.url = ""
        self.conference = ""

    @staticmethod
    def query_arxiv(title):
        result = list(arxiv.Search(
            query=title,
            max_results=1
        ).results())[0]
        return result.entry_id[21: result.entry_id.find("v", 21)]

    @staticmethod
    def get_page(url):
        res = requests.get(url=url)
        return res.text

    # get the title and arxiv_id
    def parse_page(self, html: str):
        try:
            soup = BeautifulSoup(html, 'lxml')
        except Exception:
            soup = BeautifulSoup(html, 'html.parser')
        titles = soup.select("a[title='paper title']")  # found under tag <li class="conference">
        counter = 0
        counter_failed = 0
        for title in titles:
            try:
                if counter % 250 == 0:
                    print(f"Article number {counter} titled {title.string}")
                arxiv_id = self.query_arxiv(title.string)
                yield {"arxiv_id": arxiv_id,
                        "title": title.string,  #connectionResetError every article
                        "conference": self.conference}
            except Exception as e:
                if counter_failed % 100 == 0:
                    if counter_failed % 1000 == 0:
                        break
                    print(f"{title.string} was # {counter_failed} article to not have been found")
                    print(f"The error was {e}")
                counter_failed += 1
                yield {"arxiv_id": "",
                        "title": title.string,
                        "conference": self.conference}
            counter += 1
        print(f"successfully fetched {counter} papers from {self.conference}")

    def run(self, res_file="NIPS.json", links_file='pages.txt'):
        with open(links_file, 'r') as fin:
            with open(res_file, "w") as fout:    
                for page in fin:
                    if page:
                        year = page[page.rfind('/') + 1:]
                        self.conference = f"NIPS {year}"
                        print(f"working on conference {self.conference}")
                        try:
                            html = self.get_page(page.rstrip('\n'))
                            for res in self.parse_page(html):
                                self.result.append(res)
                                # json.dump(res, fout, indent=4)
                                # NEED to json.dump here (maybe not)
                        except Exception:
                            break

        if len(self.result):
            if res_file == "system":
                print(self.result)
                return
            with open(res_file, 'w') as fout:
                json.dump(self.result, fout, indent=4)


if __name__ == '__main__':
    tmp = NIPSParser()
    print(tmp.run())