---
layout: post
title: Installing Google Cloud SDK under zsh
---

Since web development isn't my strength, I decided to enroll in [Udacity's Web Development](https://www.udacity.com/course/cs253) course today. The first assignment has us creating a simple Hello World application using [Google App Engine](https://console.developers.google.com/start/appengine). The page assists us in setting up our first project, which includes downloading [Google Cloud SDK](https://developers.google.com/cloud/sdk/).

However, if you're running [zsh](http://www.zsh.org/) as your shell, as I do, the provided instructions are not enough to get the SDK running, as they are for [bash](https://www.gnu.org/software/bash/). Google added scripts for zsh installation, but no option to select them during the installation progress (as far as I know). With a bit of tinkering, we can get the SDK installed properly, as well as enable tab completion. Here's how to do it:

1.  Download and install the SDK by running the following command in zsh (don't worry about `bash` in the command):

    ```bash
    curl https://sdk.cloud.google.com | bash
    ```

2.  Follow the instructions and select an extraction directory. Remember the path to it for later.
3.  If you're doing the same Udacity course, choose `[2] Python and PHP` to install the app engine needed.
4.  After installing the packages, you are prompted for a path to your `.bash_profile`. Leave it blank.
5.  When asked to modify your `$PATH` choose not to.
6.  The same for bash completion.
7.  Open your `.zshrc` (located in your home directory) in your favourite editor and append the following two lines:

    ```bash
    source /<path to google-cloud-sdk>/path.zsh.inc
    source /<path to google-cloud-sdk>/completion.zsh.inc
    ```
    Where `<path to google-cloud-sdk>` is the path you previously extracted the SDK to. In my case it's `/Users/andrei/google-cloud-sdk`

8. Restart terminal and type `gcloud --version`. If all went well, you should see your SDK's version number in the first line printed out.
