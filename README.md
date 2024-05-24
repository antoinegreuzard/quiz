
# Quiz Application

## Description
Ce projet est une application de quiz développée avec Spring Boot. Elle permet aux utilisateurs de répondre à des questions de quiz et de tester leurs connaissances dans divers domaines.

## Fonctionnalités
- **Interface utilisateur interactive**: Facilite la navigation et la participation aux quiz.
- **Gestion des utilisateurs**: Enregistrement et authentification des utilisateurs.
- **Base de données des questions**: Stockage et récupération des questions de quiz.

## Technologies utilisées
- Java
- Spring Boot
- Maven
- Thymeleaf
- Bootstrap
- MySQL

## Prérequis
- JDK 1.8 ou supérieur
- Maven
- MySQL Server

## Installation
Pour mettre en place et exécuter cette application localement, suivez les étapes suivantes :

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/antoinegreuzard/quiz.git
   ```
2. Naviguez dans le dossier du projet et compilez l'application :
   ```bash
   cd quiz
   mvn install
   ```
3. Exécutez l'application :
   ```bash
   mvn spring-boot:run
   ```
4. Accédez à `http://localhost:8080` dans votre navigateur pour utiliser l'application.

## Configuration de la base de données
Assurez-vous de configurer les paramètres de votre base de données MySQL dans le fichier `application.properties` avant de lancer l'application.

## Licence
Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.

## Auteur
- Antoine Greuzard - Initiateur et développeur principal
