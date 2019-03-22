drop database if exists webapp;

create database webapp;

use webapp;



create table users (
    `id` varchar(50) not null,
    `email` varchar(50) not null,
    `passwd` varchar(50) not null,
    `admin` bool not null,
    `name` varchar(50) not null,
    `image` varchar(500) not null,
    `created_at` real not null,
    `key` varchar(100) ,
    unique key `idx_email` (`email`),
    key `idx_created_at` (`created_at`),
    primary key (`id`)
) engine=innodb default charset=utf8;

create table blogs (
    `id` varchar(50) not null,
    `user_id` varchar(50) not null,
    `user_name` varchar(50) not null,
    `user_image` varchar(500) not null,
    `name` varchar(50) not null,
    `summary` varchar(200) not null,
    `content` mediumtext not null,
    `created_at` real not null,
    `public` bool not null,
    `type` varchar(50) not null,
    key `idx_created_at` (`created_at`),
    primary key (`id`),
    foreign key (`user_id`) references users (`id`)
) engine=innodb default charset=utf8;

create table comments (
    `id` varchar(50) not null,
    `blog_id` varchar(50) not null,
    `user_id` varchar(50) not null,
    `user_name` varchar(50) not null,
    `user_image` varchar(500) not null,
    `content` mediumtext not null,
    `created_at` real not null,
    `reply_to` varchar(50),
    key `idx_created_at` (`created_at`),
    primary key (`id`),
    foreign key (`blog_id`) references blogs(`id`)
) engine=innodb default charset=utf8;