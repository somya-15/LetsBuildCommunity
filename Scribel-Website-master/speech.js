// status fields and start button in UI
var phraseDiv;
var startRecognizeOnceAsyncButton;
var filePicker, audioFile;

// subscription key and region for speech services.
var subscriptionKey, serviceRegion;
var authorizationToken;
var SpeechSDK;
var recognizer;

document.addEventListener("DOMContentLoaded", function () {
  startRecognizeOnceAsyncButton = document.getElementById("startRecognizeOnceAsyncButton");
  // subscriptionKey = document.getElementById("subscriptionKey");
  // serviceRegion = document.getElementById("serviceRegion");
  speechRecognitionLanguage = document.getElementById("speechRecognitionLanguage");
  phraseDiv = document.getElementById("phraseDiv");
  filePicker = document.getElementById("filePicker");
  filePicker.addEventListener("change", function () {
    audioFile = filePicker.files[0];
    startRecognizeOnceAsyncButton.disabled = false;
  });

  // subscriptionKey.value = env.TRANSLATOR_TEXT_SUBSCRIPTION_KEY;
  // serviceRegion.value = env.AZURE_REGION;

  startRecognizeOnceAsyncButton.addEventListener("click", function () {
    startRecognizeOnceAsyncButton.disabled = true;
    phraseDiv.innerHTML = "";

    // if we got an authorization token, use the token. Otherwise use the provided subscription key
    var speechConfig;
    if (authorizationToken) {
      speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(authorizationToken, env.AZURE_REGION);
    } else {
      if (env.TRANSLATOR_TEXT_SUBSCRIPTION_KEY === "" || env.TRANSLATOR_TEXT_SUBSCRIPTION_KEY === "subscription") {
        alert("Please enter your Microsoft Cognitive Services Speech subscription key!");
        return;
      }
      speechConfig = SpeechSDK.SpeechConfig.fromSubscription(env.TRANSLATOR_TEXT_SUBSCRIPTION_KEY, env.AZURE_REGION);
    }

    speechConfig.speechRecognitionLanguage = langselect.value;
    var audioConfig = SpeechSDK.AudioConfig.fromWavFileInput(audioFile);
    recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

    recognizer.recognizeOnceAsync(
      function (result) {
        startRecognizeOnceAsyncButton.disabled = false;
        phraseDiv.innerHTML += result.text;
        window.console.log(result);



        recognizer.close();
        recognizer = undefined;
      },
      function (err) {
        startRecognizeOnceAsyncButton.disabled = false;
        phraseDiv.innerHTML += err;
        window.console.log(err);

        recognizer.close();
        recognizer = undefined;
      });
  });

  if (!!window.SpeechSDK) {
    SpeechSDK = window.SpeechSDK;
    startRecognizeOnceAsyncButton.disabled = false;

    document.getElementById('content').style.display = 'block';
    document.getElementById('warning').style.display = 'none';

    // in case we have a function for getting an authorization token, call it.
    // if (typeof RequestAuthorizationToken === "function") {
    //     RequestAuthorizationToken();
    // }
  }
});