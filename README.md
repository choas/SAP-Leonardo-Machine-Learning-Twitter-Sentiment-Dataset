# SAP Leonardo Machine Learning Twitter Sentiment Analysis Dataset

Download the *Twitter Sentiment Analysis Dataset* file from [Twitter Sentiment Analysis Training Corpus (Dataset)](http://thinknook.com/twitter-sentiment-analysis-training-corpus-dataset-2012-09-22/).

Extract it into the project folder:

```sh
unzip Sentiment-Analysis-Dataset.zip
```

... and run:

```sh
node create_twitter_sentiment_dataset.js [<take_every>]
```

Take every take_every item (default 100) and create a sentiment zip file with the following structure:

```text
sentiment
├── test
│   ├── negative
│   └── positive
├── training
│   ├── negative
│   └── positive
└── validation
    ├── negative
    └── positive
```
