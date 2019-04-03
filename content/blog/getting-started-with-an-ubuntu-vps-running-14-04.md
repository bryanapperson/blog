+++
title = "Getting Started with an Ubuntu VPS Running 14.04"
date = "2014-09-01 22:43:23"
tags = ['linux-tutorials']
+++

When you get a new Ubuntu VPS or server there are a few things you want to make sure are taken care of right off the bat. This will optimize the security and usability of your server, providing a reliable foundation for subsequent alterations. If you need an Ubuntu VPS you can get one for $5 [here](https://www.bitronictech.net/ubuntu-vps-hosting.php "Ubuntu VPS for $5").

### Step One

Logging into your new VPS is the first step. You'll need to know the public IP address of the server to begin. You'll also need to know the password for the "root" user. Once you know those two things you are ready to login. The public IP address is e-mailed to you and you can view the credentials you chose in your client area if the VPS is hosted with Bitronic Technologies (my company). In Linux the root user an administrator with sweeping privileges. Because the root user has the power to irreversibly damage a system you shouldn't use root for daily use. It is best to login as a user with limited privileges and then to "sudo" root when you need to in the case of Ubuntu 14.04. In this tutorial we will cover how to login as root, create an alternate user for day-to-day use, disable root login and how to login as an alternate (non-root) user, then escalate to root. As mentioned, logging in is the first step to getting started with your Ubuntu 14.04 VPS. Initially the only account is the root account. If you are using Linux connect to the server using the "ssh" command at terminal. If you are using windows consider using an SSH program like putty. For purposes of this article we will assume you are running Linux on your PC, however all of the same steps will apply either way except for initial login. If you are using Windows you will need to open putty, enter the root@pub.lic.ipa.ddr (the dotted quad public IP of your VPS) then login and enter the password. On linux just run this command in terminal:

`ssh root@pub.lic.ipa.ddr`

Of course entering your public IP address in place of those letters. You will then most likely see a warning in your terminal that looks like this:

```bash
The authenticity of host '138.137.136.135 (138.137.136.135)' can't be established.
ECDSA key fingerprint is
79:95:46:1a:ab:37:11:8e:86:54:36:38:bb:3c:fa:c0.
Are you sure you want to continue connecting (yes/no)?
```

Your computer is letting you know that it does not recognize your remote server. This is expected behaviour because it is the first time this connection is being made. However if you see this message in the future (on the same computer) it can be a sign that your server has been compromised (assuming you haven't reinstalled the operating system). It is safe to type "yes" and accept the connection. Then you will need to enter the password for the root account.

### Step Two

You may wish to change the root password to something more memorable. Make sure to use a strong password as root login is the "key to the kingdom" so to speak. A good password can be a sentence like "IlikedtheFordBroncoin1996!" or a random string. But it should ideally contain uppercase/lowercase letters, numbers and at least 1 special character. While logged in as root it is easy to change the password by typing:

`passwd`

You will be prompted to enter and then confirm your new root password. You will not see any characters display on the screen while you are typing (this is an intentional security measure).

### Step Three

The third step in preparing and securing your new Ubuntu 14.04 VPS is to add a new user. This is going to be the account you'll use to login after the end of the tutorial, so make sure the username is memorable. For the purposes of this tutorial we are going to make the username "demo", but you should select a more meaningful username. So to add the user just run this command:

`adduser demo`

You will then be prompted with a few questions, starting with the password you want to use for the account. It is recommended that you choose a different password then the one you used for the root account as an added security measure. So go ahead and fill out the password, then optionally provide the other details requested. If you don't want to fill those out you can just hit enter and Ubuntu will skip those fields.

### Step Four

In step four we will provide the new user we just created in step three with the ability to escalate to root. This allows you to gain root access without having to allow remote root login, or logout and log back in as root if you do choose to leave root login over SSH enable (not recommended). In Ubuntu we use the command "sudo" to escalate to root. This allows a normal user to run a command that requires root privileges. You can also use the "sudo -i" command to assume the identity of root until you use the command "exit". To add the new user we just created to the list of users who can use "sudo" to attain root, we need to use a command called "visudo". This command will open a configuration file. Go ahead and type:

`visudo`

Then scroll down until you find a section that looks similar to this:

```
# User privilege specification
root ALL=(ALL:ALL) ALL
```

This may look complex to you but that line is non-consequential and we don't need to alter it. Just add another line below it that follows the format, replacing "demo" with the username you created in step three. The result should look like this:

```
# User privilege specification
root ALL=(ALL:ALL) ALL
demo ALL=(ALL:ALL) ALL
```

After you have made the changes, press CTRL-X to exit visudo. You will have to type "Y" to save the file and "ENTER" to confirm the location (you can use the provided value).

### Step Five (Optional)

This step is optional but is highly recommended for optimal security going forward. You can secure your server a bit more by disabling root login over SSH entirely and changing SSH to a non default port. The process is fairly straightforward. Get started by opening the sshd configuration file with a text editor as root. You can use any text editor installed on your VPS but for this tutorial we will assume you use "nano". Nano is a fairly easy to use command line text editor for Linux. So go ahead and type this command:

`nano /etc/ssh/sshd_config`

### Step Five-A (Optional)

The first thing to do is to change the port that SSHD listens on. Find the line that looks like this:

`Port 22`

Change this number to something between 1025 and 65536, make sure it does not conflict with the port of another program you plan on running. This is helpful in preventing unauthorized users from trying to break into the system over SSH. If you change from the default port it adds an extra step of sniffing for them to find it and you can even add a firewall rule to block IPs for port scanning of use a tool like ConfigServer Firewall to do so. If you do change this value make sure you remember it or write it down. You will need to know this port to reconnect to your server. For the purposes of this guide we will change the port to 3333. Remember you will need to tell your ssh client to connect to port 3333 (or the port you choose) in the future. So change the line to look like this (or the port you choose):

`Port 3333`

Save the file using "CTRL-O", "Y" then exit "CTRL-X". Now we are going to enable Ubuntu's UFW (Uncomplicated Firewall). Enter this command:

`sudo ufw enable`

Then we are going to make sure that port 3333 or whatever port you chose is open. Run the command:

`sudo ufw allow 3333`

Replace 3333 with whatever port you decided to use then run:

```
sudo service ufw restart
sudo service ssh restart
```

Now you can reconnect via the port you chose in the future.

### Step Five-B (Optional)

The next thing we can do for added security is to restrict remote root login over SSH. Run the command:

`nano /etc/ssh/sshd_config`

Then find the line that looks like this:

`PermitRootLogin yes`

Change this to:

`PermitRootLogin no`

This is a much more secure setting as it discourages the direct brute force or the root password. This is especially effective if you use a different password for your "day-to-day" user then you do for root. If you run:

`sudo service ssh restart`

You will no longer be able to login as root, only as the alternate user you created.

### Step Five-C (Optional)

If you wanted to go one step further you could explicitly specify which users can connect to your server via SSH. This might not be needed now, but can become useful as you add additional users. Any user not on the list you are about to configure will not be able to login over SSH at all. You should use caution when configuring this as you can lock your self out of your server entirely. We are going to need to open the SSHD configuration again:

`nano /etc/ssh/sshd_config`

You'll have to add this line yourself as it does not exist by default. Make sure to replace "demo" with the username you created in step 3.

`AllowUsers demo`

When you have added the line and triple checked that the syntax and username are correct, save and close the file using "CTRL-O", "Y" and then "CTRL-X" as we covered earlier. Then go ahead and restart SSHD again:

`sudo service ssh restart`

Before you log out of the server, test your configuration by opening another connection using the user, password and port that you have created in this guide. If you can't connect go back and correct your errors using the original connection (which you should not close until you are sure that your settings work). If you followed this guide the command you would use is:

`ssh -p 3333 demo@ser.ver.ipa.ddr`

Replacing the port and user with the ones you chose. Then entering the password for the user you created in step 3. Remember from now on you will have to use the sudo command to run commands that need root:

`sudo your_command`

You can now close both connections by typing exit in each window.

### What's Next?

You now have a fairly secure server, however you can continue further securing you server by installing fail2ban or a similar utility to help prevent brute force and port scanning attacks. Outside of that you are ready to install LAMP, LEMP or whatever other programs you want to run on your VPS! Leave us your thoughts in the comments below and check out our other Ubuntu VPS articles.
