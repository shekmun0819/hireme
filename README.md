# HireMe Website

This is a website built using **React 18**, **Material UI 5**, **Django 4** and **Django REST Framework 3**.

## Table of Contents 
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the application](#run-the-application)
- [Adding data to the application](#add-data-to-the-application)
- [Change database name](#change-database-name)
- [Prompt OpenSSL error](#prompt-OpenSSL-error)


## Prerequisites

Install the following prerequisites:

1. [Python 3.10.6 or higher](https://www.python.org/downloads/)
2. [Node.js 18.6.0 or higher](https://nodejs.org/en/)
3. [Visual Studio Code](https://code.visualstudio.com/download)


## Installation

### Backend

#### 1. Create a virtual environment

From the **root** directory run:

```bash
cd backend
```
```bash
conda create --name hireme_backend python=3.9
```

#### 2. Activate the virtual environment

From the **backend** directory run:

On macOS:

```bash
source venv/bin/activate
```

On Windows:

```bash
conda activate hireme_backend
```

#### 3. Install mysqlclient

From the **backend** directory run:

```bash
pip install mysqlclient
```

If failed, watch this video https://www.youtube.com/watch?v=qg4XiY1YEyQ&t=766s from 10.30 mins.
You will need to download the required file from here https://www.lfd.uci.edu/~gohlke/pythonlibs/.

#### 4. Install XAMPP to access phpmyadmin

1. Install XAMPP from https://www.apachefriends.org/download.html
2. Run XAMPP as administrator
3. Start Apache and MySQL
4. Click on the Admin action of MySQL
5. Create new database named "hireme" in phpmyadmin

#### 5. Install required backend dependencies

From the **backend** directory run:

```bash
pip install -r requirements.txt
```

#### 6. Run migrations

From the **backend** directory run:

```bash
python manage.py makemigrations
```
```bash
python manage.py migrate
```

#### 7. Create an admin user to access the Django Admin interface

From the **backend** directory run:

```bash
python manage.py createsuperuser
```

When prompted, enter a username, email, and password.

### Frontend

#### 1. Install required frontend dependencies

From the **root** directory run:

```bash
cd frontend
```
```bash
npm install
```

## Run the application

To run the application, you need to have both the backend and the frontend up and running.

#### 1. Run backend

From the **backend** directory run:

```bash
python manage.py runserver
```

#### 2. Run frontend

From the **frontend** directory run:

```bash
npm start
```

#### 3. View the application

Go to http://localhost:3000/ to view the application.


## Add data to the application

Add data through Django Admin.

Go to http://127.0.0.1:8000/admin to access the Django Admin interface and sign in using the admin credentials.

## Change database name

1. Go to **backend** folder, under **config** folder, open **settings.py**.
2. Find the database name and change accordingly.
```bash
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'hireme',
        'HOST': '127.0.0.1',
        'PORT': '3306',
        'USER': 'root',
        'PASSWORD': '',
    }
}
```
3. Go to phpmyadmin, create a new database with the name you defined above.

## Prompt OpenSSL error

Go to location where you've install anaconda anaconda3>Library>bin. Search and copy following dll files

	libcrypto-1_1-x64.dll
	libssl-1_1-x64.dll

and paste to anaconda3>DLLs.
