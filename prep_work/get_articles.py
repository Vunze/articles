import arxiv


def get_articles(q="machine learning", max_res=20):
    search = arxiv.Search(
      query=q,
      max_results=max_res,
      sort_by=arxiv.SortCriterion.Relevance
    )

    confs = set()
    with open('result.txt') as f:
        for i in range(256):
            confs.add(f.readline()[0:-1])
    for result in search.results():
        if result.comment:
            split_comm = set()
            for x in result.comment.split(','):
                split_comm.update(x.split())
            intersection = confs.intersection(split_comm)
            if len(intersection) > 0:
                # print(result.title)
                # print(intersection)
                yield [result, intersection]
            else:
                yield [result, None]
        # else:
        #    yield [result, None]
