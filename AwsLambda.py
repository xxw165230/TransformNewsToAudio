import boto3
import os
import uuid
from contextlib import closing


def lambda_handler(event, context):
    text1 = event['text1']
    text2 = event['text2']
    text3 = event['text3']
    text = [text1, text2, text3]
    urllist = []

    for i in text:
        postId = str(uuid.uuid4())
        voice = event["voice"]

        print('Generating new DynamoDB record, with ID: ' + postId)
        print('Input Text: ' + i)
        print('Selected voice: ' + voice)

        rest = i

        # Because single invocation of the polly synthesize_speech api can
        # transform text with about 1,500 characters, we are dividing the
        # post into blocks of approximately 1,000 characters.
        textBlocks = []
        while (len(rest) > 1100):
            begin = 0
            end = rest.find(".", 1000)

            if (end == -1):
                end = rest.find(" ", 1000)

            textBlock = rest[begin:end]
            rest = rest[end:]
            textBlocks.append(textBlock)
        textBlocks.append(rest)

        # For each block, invoke Polly API, which will transform text into audio
        polly = boto3.client('polly')
        for textBlock in textBlocks:
            response = polly.synthesize_speech(
                OutputFormat='mp3',
                Text=textBlock,
                VoiceId=voice
            )

            # Save the audio stream returned by Amazon Polly on Lambda's temp
            # directory. If there are multiple text blocks, the audio stream
            # will be combined into a single file.
            if "AudioStream" in response:
                with closing(response["AudioStream"]) as stream:
                    output = os.path.join("/tmp/", postId)
                    with open(output, "a") as file:
                        file.write(stream.read())

        s3 = boto3.client('s3')
        s3.upload_file('/tmp/' + postId,
                       os.environ['BUCKET_NAME'],
                       postId + ".mp3")

        s3.put_object_acl(ACL='public-read',
                          Bucket=os.environ['BUCKET_NAME'],
                          Key=postId + ".mp3")

        location = s3.get_bucket_location(Bucket=os.environ['BUCKET_NAME'])
        region = location['LocationConstraint']

        if region is None:
            url_begining = "https://s3.amazonaws.com/"
        else:
            url_begining = "https://s3-" + str(region) + ".amazonaws.com/" \
 \
                    url = url_begining \
                          + str(os.environ['BUCKET_NAME']) \
                          + "/" \
                          + str(postId) \
                          + ".mp3"

        print('url' + url)
        urllist.append(url)
        print(urllist)
    return urllist
