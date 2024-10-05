<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/TheoMeunier/filemanager">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Filemanager</h3>

  <p align="center">
    <br />
    <a href="https://github.com/TheoMeunier/filemanager"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/TheoMeunier/filemanager">View Demo</a>
    ·
    <a href="https://github.com/TheoMeunier/filemanager/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/TheoMeunier/filemanager/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- ABOUT THE PROJECT -->

## About The Project

FileManager S3/Local is a versatile file manager that offers a flexible storage solution, enabling the use of Amazon S3
or local storage. Featuring an intuitive user interface and robust administration panel, it aims to simplify file
management for businesses and developers.

### Built With

* [![React][React.js]][React-url]
* [![Kotlin][Kotlin.js]][Kotlin-url]
* [![MariaDB][MariaDB.js]][MariaDB-url]

<!-- GETTING STARTED -->

## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/TheoMeunier/filemanager
   ```
2. Configuring the `.env` end `front/.env` file

3. Build front-end
   ```sh 
    cd front
    npm install
    npm run build
   ```
4. Build back-end
   ```sh
    ./gradlew build
   ```

#### Docker

1. Create a docker-compose file
```yml
services:
  front:
    image: theomeunier/filemanager-front
    container_name: filemanager_front
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_URL: http://localhost:8080
    networks:
      - app_network

  back:
    image: theomeunier/filemanager-back
    container_name: filemanager_back
    restart: unless-stopped
    ports:
      - "8080:8080"
    volumes:
      - ./cache:/app/storages/cache
      - ./storage:/app/storages/uploads
    env_file:
      - .env
    networks:
      - app_network

  mariadb:
    image: mariadb:latest
    container_name: mariadb_tmeunier_cdn_database
    restart: unless-stopped
    ports:
      - "3306:3306"
    environment:
      MYSQL_DATABASE: filemanager
      MYSQL_USER: filemanager
      MYSQL_PASSWORD: filemanager
      MYSQL_ROOT_PASSWORD: filemanager
    volumes:
      - ./storage-db:/var/lib/mysql/
      - ./docker/mysql/my.cnf:/etc/mysql/my.cnf
    networks:
      - app_network

networks:
  app_network:
    driver: bridge

```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any
contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also
simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- MARKDOWN LINKS & IMAGES -->

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB

[React-url]: https://reactjs.org/

[Kotlin.js]: https://img.shields.io/badge/kotlin-7F52FF?style=for-the-badge&logo=kotlin&logoColor=FF5722

[Kotlin-url]: https://kotlinlang.org/

[MariaDB.js]: https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white

[MariaDB-url]: https://mariadb.org/
