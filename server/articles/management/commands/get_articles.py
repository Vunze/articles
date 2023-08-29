import arxiv
import json


def get_NIPS():

    with open("NIPS.json") as nips:
        nips_json = json.load(nips)

    search = arxiv.Search(
        id_list=nips_json[0]
    )

    articles = []

    for result in search.results():

        if not result.comment:
            result.comment = ""

        arxiv_id = result.entry_id[21: result.entry_id.find("v", 21)]
        articles.append([result, nips_json[1][arxiv_id]])

    return articles


def get_articles(q="machine learning", max_res=20):
    search = arxiv.Search(
        query=q,
        max_results=max_res,
        sort_by=arxiv.SortCriterion.Relevance
    )

    confs = set()
    res = []
    articles = []
    with open('result.txt') as f:
        for i in range(256):
            confs.add(f.readline()[0:-1])
    print("Working on getting the results...")
    for result in search.results():
        if result.comment:
            split_comm = set()
            for x in result.comment.split(','):
                split_comm.update(x.split())
            intersection = confs.intersection(split_comm)
            if len(intersection) > 0:
                conference = intersection.pop()
                dict1 = {"value": conference, "label": conference}
                if dict1 not in res:
                    res.append(dict1)
                articles.append([result, conference])
                continue
        result.comment = ""
        articles.append([result, ""])
    res = sorted(res, key=lambda d: d["value"])
    out_file = open("confs.js", "w")
    json.dump(res, out_file, indent=4, sort_keys=False)
    out_file.close()
    print("done")
    return articles
