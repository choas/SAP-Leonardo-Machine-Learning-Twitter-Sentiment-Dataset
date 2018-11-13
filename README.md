# SAP Leonardo Machine Learning Twitter Sentiment Analysis Dataset

Download the *Twitter Sentiment Analysis Dataset* file from [Twitter Sentiment Analysis Training Corpus (Dataset)](http://thinknook.com/twitter-sentiment-analysis-training-corpus-dataset-2012-09-22/).

Extract it into the project folder:

```sh
unzip Sentiment-Analysis-Dataset.zip
```

... and run:

```sh
node create_twitter_sentiment_dataset.js
```

This creates a sentiment folder with the following structure:

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

Change the folder and zip the files:

```sh
cd sentiment
zip -r sentiment.zip test training validation
```
