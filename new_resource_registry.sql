-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Час створення: Квт 11 2016 р., 23:03
-- Версія сервера: 5.5.47-0ubuntu0.14.04.1
-- Версія PHP: 5.5.9-1ubuntu4.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- База даних: `resource_registry`
--

DELIMITER $$
--
-- Функції
--
CREATE DEFINER=`root`@`localhost` FUNCTION `distance`(lat1 FLOAT, lng1 FLOAT, lat2 FLOAT, lng2 FLOAT) RETURNS float
BEGIN
	DECLARE pi80 FLOAT;
	DECLARE r FLOAT;
	DECLARE dlat FLOAT;
	DECLARE dlng FLOAT;
	DECLARE a FLOAT;
	DECLARE c FLOAT;
	DECLARE km FLOAT;
	
	SET pi80 = PI() / 180;
	SET lat1 = lat1 * pi80;
	SET lng1 = lng1 * pi80;
	SET lat2 = lat2 * pi80;
	SET lng2 = lng2 * pi80;
 
	SET r = 6372.797; 
	SET dlat = lat2 - lat1;
	SET dlng = lng2 - lng1;
	SET a = sin(dlat / 2) * sin(dlat / 2) + cos(lat1) * cos(lat2) * sin(dlng / 2) * sin(dlng / 2);
	SET c = 2 * atan2(sqrt(a), sqrt(1 - a));
	SET km = r * c;

  RETURN km;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Структура таблиці `attribute_class_view`
--

CREATE TABLE IF NOT EXISTS `attribute_class_view` (
  `view_id` int(11) NOT NULL AUTO_INCREMENT,
  `attribute_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  PRIMARY KEY (`view_id`),
  KEY `fk_attribute_class_view_resource_attribute1_idx` (`attribute_id`),
  KEY `fk_attribute_class_view_resource_class1_idx` (`class_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблиці `community`
--

CREATE TABLE IF NOT EXISTS `community` (
  `community_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `prefix` varchar(50) DEFAULT NULL,
  `commissioner_id` int(11) NOT NULL,
  PRIMARY KEY (`community_id`),
  KEY `fk_community_user` (`commissioner_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Дамп даних таблиці `community`
--

INSERT INTO `community` (`community_id`, `name`, `prefix`, `commissioner_id`) VALUES
(1, 'first_community', '10002:001', 31),
(2, 'second_community', '10003:001', 38);

-- --------------------------------------------------------

--
-- Структура таблиці `membership`
--

CREATE TABLE IF NOT EXISTS `membership` (
  `community_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  KEY `fk_membership_community` (`community_id`),
  KEY `fk_membership_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп даних таблиці `membership`
--

INSERT INTO `membership` (`community_id`, `user_id`) VALUES
(1, 31),
(2, 38);

-- --------------------------------------------------------

--
-- Структура таблиці `operation`
--

CREATE TABLE IF NOT EXISTS `operation` (
  `operation_id` int(11) NOT NULL AUTO_INCREMENT,
  `date_log` datetime NOT NULL,
  `type_id` int(11) NOT NULL,
  `user_id` varchar(50) DEFAULT NULL,
  `resource_id` int(11) NOT NULL,
  `before_change` text,
  PRIMARY KEY (`operation_id`),
  KEY `fk_transactions_transaction_type1_idx` (`type_id`),
  KEY `fk_transactions_users1_idx` (`user_id`),
  KEY `fk_operation_resource1_idx` (`resource_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=12 ;

--
-- Дамп даних таблиці `operation`
--

INSERT INTO `operation` (`operation_id`, `date_log`, `type_id`, `user_id`, `resource_id`, `before_change`) VALUES
(4, '2015-10-27 14:04:25', 2, 'Петренко Петро Петрович\nпаспортні дані : EE123456', 96, 'дата створення : 2015-10-04 -> 2015-10-11|'),
(5, '2015-10-27 14:05:54', 2, 'Петренко Петро Петрович\nпаспортні дані : EE123456', 96, 'дата створення : 1970-01-08 -> 2015-10-27|'),
(6, '2015-10-27 14:06:41', 2, 'Петренко Петро Петрович\nпаспортні дані : EE123456', 48, 'дата створення : 2015-10-27 -> 1970-01-01|'),
(7, '2015-10-27 14:07:09', 2, 'Петренко Петро Петрович\nпаспортні дані : EE123456', 48, 'дата створення : 1970-01-01 -> 1970-01-02|'),
(9, '2015-10-29 21:47:10', 2, 'Петро Петро Петро| \r\n	паспортні дані : EE 123456', 96, 'назва ресурсу: Митрополивчі сади->Митрополивчі сад|'),
(10, '2015-10-29 21:47:47', 2, 'Петро Петро Петро| \r\n	паспортні дані : EE 123456', 97, 'назва ресурсу: Піскові Озера->Піскові Озера Старі|'),
(11, '2015-10-29 21:48:09', 2, '', 99, 'назва ресурсу: Стрий Самбір->Самбір|');

-- --------------------------------------------------------

--
-- Структура таблиці `operation_type`
--

CREATE TABLE IF NOT EXISTS `operation_type` (
  `type_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`type_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Дамп даних таблиці `operation_type`
--

INSERT INTO `operation_type` (`type_id`, `name`) VALUES
(1, 'Створення ресурсу'),
(2, 'Редагування ресурсу'),
(3, 'Видалення ресурсу');

-- --------------------------------------------------------

--
-- Структура таблиці `parameter`
--

CREATE TABLE IF NOT EXISTS `parameter` (
  `parameter_id` int(11) NOT NULL AUTO_INCREMENT,
  `value` int(11) NOT NULL,
  `resource_id` int(11) NOT NULL,
  `attribute_id` int(11) NOT NULL,
  PRIMARY KEY (`parameter_id`),
  KEY `fk_stats_resources1_idx` (`resource_id`),
  KEY `fk_stats_resource_attributes1_idx` (`attribute_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=243 ;

--
-- Дамп даних таблиці `parameter`
--

INSERT INTO `parameter` (`parameter_id`, `value`, `resource_id`, `attribute_id`) VALUES
(201, 12943, 185, 4),
(202, 450, 185, 7),
(203, 7998, 186, 4),
(204, 935, 186, 7),
(241, 172, 208, 7),
(242, 1390, 208, 4);

-- --------------------------------------------------------

--
-- Структура таблиці `personal_data`
--

CREATE TABLE IF NOT EXISTS `personal_data` (
  `personal_data_id` int(11) NOT NULL AUTO_INCREMENT,
  `last_name` varchar(40) NOT NULL,
  `first_name` varchar(40) NOT NULL,
  `middle_name` varchar(40) NOT NULL,
  `passport_series` varchar(5) NOT NULL,
  `passport_number` varchar(10) NOT NULL,
  `address` varchar(100) NOT NULL,
  `registrar_key` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`personal_data_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=174 ;

--
-- Дамп даних таблиці `personal_data`
--

INSERT INTO `personal_data` (`personal_data_id`, `last_name`, `first_name`, `middle_name`, `passport_series`, `passport_number`, `address`, `registrar_key`) VALUES
(1, 'Miekh', 'Dmytro', 'Uriyovich', 'NM', '123456', 'Lviv', '804:23:17:026:'),
(2, 'Miekh2', 'Dmytro2', 'Uriyovich2', 'NM2', '123451', 'Lvi2', '804:23:17:026:'),
(41, 'd', 'd', 'd', 'dd', '11111', 'd', NULL),
(43, 'Aaaa', 'Aaaa', 'Aaaa', 'AA', '111111', 'Aaaa', NULL),
(44, 'Aaa', 'Aaa', 'Aaaa', 'AA', '111111', 'Aaaa', NULL),
(45, 'Aaaa', 'Aaaa', 'Aaaa', 'AA', '111111', 'Aaaa', NULL),
(53, 'Aaaa', 'Aaaa', 'Aaaa', 'AA', '111111', 'Aaaa', NULL),
(58, 'Aaaa', 'Aaaa', 'Aaaa', 'AA', '111111', 'Aaaa', NULL),
(60, 'Aaaa', 'Aaaa', 'Aaaa', 'AA', '111111', 'Aaaa', NULL),
(61, 'Aaaa', 'Aaaa', 'Aaaa', 'AA', '111111', 'Aaaa', NULL),
(64, 'Aaaa', 'Aaaa', 'Aaaa', 'AA', '111111', 'Aaaa', NULL),
(65, 'Aaaa', 'Aaaa', 'Aaaa', 'AA', '111111', 'Aaaa', NULL),
(67, 'Aaaa', 'Aaaa', 'Aaaa', 'AA', '11111', 'Aaaa', NULL),
(68, 'Aaaa', 'Aaaa', 'Aaaa', 'AA', '111111', 'Aaaa', NULL),
(69, 'Bbbbb', 'Bbbbb', 'Bbbb', 'AA', '111112', 'Bbbbb', NULL),
(70, 'name', 'name', 'name', 'AA', '77777', 'lviv', NULL),
(71, 'Baaa', 'Aaaa', 'Aaaa', 'CC', '222222', 'Aaaa', NULL),
(72, 'Bfff', 'Bfff', 'Bfff', 'DD', '333333', 'Bfff', NULL),
(73, 'Aaaa', 'Aaaa', 'Aaaa', 'AA', '111111', 'Aaaa', NULL),
(74, 'Aaaa', 'Aaaa', 'Aaaa', 'AA', '111111', 'Aaaa', NULL),
(75, 'Aaa123', 'Aaa123', 'Aaa123', 'AA', '11111', 'Aaa123', NULL),
(94, 'test36', 'test36', 'test36', 'TE', '123456', 'test36', NULL),
(97, 'test37', 'test37', 'test37', 'TE', '56565', 'test37', NULL),
(98, 'test37', 'test37', 'test37', 'TE', '56565', 'test37', NULL),
(101, 'test37', 'test37', 'test37', 'TE', '56565', 'test37', NULL),
(102, 'jhgjhgj', 'jhgjghjgh', 'ghfghf', 'kh', 'khkuh', 'kuhkuh', NULL),
(103, 'jhgjhgj', 'jhgjghjgh', 'ghfghf', 'kh', 'khkuh', 'kuhkuh', NULL),
(104, 'jhgjhgj', 'jhgjghjgh', 'ghfghf', 'kh', 'khkuh', 'kuhkuh', NULL),
(105, 'jhgjhgj', 'jhgjghjgh', 'ghfghf', 'kh', 'khkuh', 'kuhkuh', NULL),
(106, 'jhgjhgj', 'jhgjghjgh', 'ghfghf', 'kh', 'khkuh', 'kuhkuh', NULL),
(107, 'Петров', 'Василий', 'Петрович', 'КН', '374826374', 'Виговського 67', NULL),
(108, 'Петров', 'Василий', 'Петрович', 'КН', '374826374', 'Виговського 67', NULL),
(109, 'gfbgf', 'grgrk', 'knklbrt', 'tg', 'bgbg', 'bgbg', NULL),
(111, 'Шевчук', 'Віталій', 'Сергійович', 'КС', '123', 'Адреса', NULL),
(112, 'Петров', 'Иван', 'Иванович', 'КС', '34536574', 'виговського 7', NULL),
(113, 'Петренко', 'Петро', 'Петрович', 'EE', '123456', '29000, м. Хмельницький, вул. Героїв Майдану, 17, кв. 17', '804:23:17:026:'),
(114, 'last', 'first', 'midl', 'ME', '55555', 'Lv', '804:23:17:026:'),
(115, 'Ivanovych', 'Ivan', 'Ivanenko', 'FT', '6644', 'Lviv', NULL),
(116, 'Petrovych', 'Petro', 'Petrenko', 'KK', '5555', 'Lviv', NULL),
(117, 'Koval', 'P', 'P', 'KA', '77777', 'Addr', NULL),
(118, 'P', 'P', 'E', 'DD', '33333', 's', NULL),
(119, 'P', 'Psd', 'E', 'DD', '33333', 's', NULL),
(120, 'P', 'Psd', 'E', 'DD', '33333', 's', NULL),
(121, 'P', 'Psd', 'E', 'DD', '33333', 's', NULL),
(122, 'Грабар', 'Роман', 'Іванович', 'МЕ', '11111', 'м.Самбір., Шухевича 53', NULL),
(123, 'Васильєв', 'Володимир', 'Володимирович', 'МЕ', '1234', 'Дніпропетровськ вул, Червоний камінь., Україна', NULL),
(124, 'Тест', 'Тест', 'Тест', 'МЕ', '55555', 'Тест', NULL),
(125, 'ТЕСТ', 'ТЕСТ', 'ТЕСТ', 'ТЕСТ', 'ТЕСТ', 'ТЕСТ', NULL),
(126, 'ЬК', 'ЬК', 'ЬК', 'ЬУ', 'ЬК', 'ЬК', NULL),
(127, 'Андрюшенко', 'Іван', 'Миколаєвич', 'МЕ', '55555', 'м.Київ., Україна', NULL),
(128, 'Андрюшенко', 'Іван', 'Миколаєвич', 'МЕ', '55555', 'м.Київ., Україна', NULL),
(129, 'лрл', 'лр', 'лр', 'ИУ', '3333', 'ло', NULL),
(130, 'фів', 'фів', 'фів', 'ТУ', '33333', 'фі', NULL),
(131, 'фів', 'фів', 'фів', 'ТУ', '33333', 'фі', NULL),
(132, 'ло', 'ло', 'ло', 'Му', '44444', 'ло', NULL),
(133, 'р', 'о', 'р', 'м', '77777', 'р', NULL),
(134, 'Коваль', 'Петро', 'Петрович', 'МЕ', '55555', 'м. Львів ., вул.,Смаль-стоцького', NULL),
(135, 'Коваль', 'Петро', 'Петрович', 'МЕ', '55555', 'м. Львів ., вул.,Смаль-стоцького', NULL),
(136, 'Р', 'Р', 'Р', 'МЕ', '55555', 'р', NULL),
(137, 'Назаренко', 'Саргій', 'Олексійович', 'МЕ', '5555', 'Львів', NULL),
(138, 'Назаренко', 'Саргій', 'Олексійович', 'МЕ', '5555', 'Львів', NULL),
(139, 'Назаренко', 'Сергій', 'Олексійович', 'МЕ', '12345', 'Львів', NULL),
(140, 'Грабич', 'Олексій', 'Миколаєвич', 'МЕ', '55555', 'м., Київ', NULL),
(141, 'Грабич', 'Олексій', 'Миколаєвич', 'МЕ', '55555', 'м., Київ', NULL),
(142, 'Коваль', 'Петро', 'Петрович', 'МЕ', '5555', 'м.Київ', NULL),
(143, 'Коваль', 'Петро', 'Петрович', 'МЕ', '55555', 'м.Київ', NULL),
(144, 'Коваль', 'Петро', 'Петрович', 'МЕ', '55555', 'м.Київ', NULL),
(145, 'Коваль', 'Петро', 'Петрович', 'МЕ', '55555', 'м.Київ', NULL),
(146, 'Коваль', 'Петро', 'Петро', 'Ме', '55555', 'Петро', NULL),
(147, 'ар', 'ра', 'ра', 'ві', '55555', 'ра', NULL),
(148, 'КК', 'КК', 'КК', 'МЕ', '66666', 'ОРЛР', NULL),
(149, 'фівф', 'фів', 'фів', 'МЕ', '66655', 'фів', NULL),
(150, 'лрл', 'лрлор', 'лрл', 'ММ', '55555', 'лорло', NULL),
(151, 'kjhk', 'khk', 'kh', 'VR', '88888', 'kjh', NULL),
(152, 'kjhk', 'khk', 'kh', 'VR', '88888', 'kjh', NULL),
(153, 'лрл', 'лрлор', 'лрл', 'ММ', '55555', 'лорло', NULL),
(154, 'jhgj', 'khkhjh', 'khjkh', 'ZZ', '77777', 'kjhkj', NULL),
(155, 'khk', 'khkjh', 'khkjh', 'BR', '88888', 'kjhkj', NULL),
(156, 'hk', 'khkjh', 'khk', 'BR', '77774', 'jhjk', NULL),
(157, 'lkjkljk', 'kjlkj', 'llkjlkj', 'BBD', 'jlkjl', 'jkjlj', NULL),
(158, 'jhk', 'khjk', 'kjh', 'ew', '88888', 'kjk', NULL),
(159, 'kh', 'khk', 'kjhk', 'NN', '77777', 'kjhk', NULL),
(160, 'kjhk', 'kjhk', 'khkjh', 'BB', '77777', 'kjhk', NULL),
(161, 'jhg', 'jgj', 'jhgj', 'MM', '66666', 'jhgj', NULL),
(162, 'khk', 'kjhk', 'khk', 'BB', '66666', 'h', NULL),
(163, 'kjkjh', 'jhkh', 'kjhkjh', 'vt', '2323', 'jkhjkhk', NULL),
(164, 'Грабар', 'Роман', 'Іванов', 'МЕ', '23233', 'SAN FRANCISCO', NULL),
(165, 'RRR', 'RRR', 'RRR', 'VT', '66666', 'RRR', NULL),
(166, 'Грабар', 'Роман', 'Іванович', 'МЕ', '55555', 'м.Самбір., Львівська обл.', NULL),
(167, 'Грабар', 'Роман', 'Іванович', 'МЕ', '55555', 'м.Самбір., Львівська обл.', NULL),
(168, 'Лисикевич', 'Володимир', 'Володимирович', 'ME', '55555', 'Львів., Володимира Великого, 63', NULL),
(169, 'Коваль', 'Валерій', 'Петрович', 'МЕ', '12345', 'Львів., вул. Шевченка 56', NULL),
(170, 'Іванов', 'Сергій', 'Миколайович', 'МЕ', '55555', 'Самбір ., вул. Шухевича 68', NULL),
(171, 'Грабар', 'Роман', 'Іванович', 'МЕ', '6666', 'Львів', NULL),
(172, 'Архилюк', 'Олесандр', 'Олександрович', 'КВ', '139406', 'м.Львів', NULL),
(173, 'Іванюк', 'Микола', 'Іванович', 'пп', '8888', 'м. Львів вул. Низинна', NULL);

-- --------------------------------------------------------

--
-- Структура таблиці `resource`
--

CREATE TABLE IF NOT EXISTS `resource` (
  `resource_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `class_id` int(11) NOT NULL,
  `coordinates` text NOT NULL,
  `coords_center_lat` float NOT NULL,
  `coords_center_lng` float NOT NULL,
  `owner_data_id` int(11) DEFAULT NULL,
  `reason` text NOT NULL,
  `date` date DEFAULT NULL,
  `registrar_data_id` int(11) DEFAULT NULL COMMENT 'Для контролювання особи дії над ресурсом',
  `registration_number` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`resource_id`),
  KEY `fk_resource_resource_class1_idx` (`class_id`),
  KEY `fk_resource_personal_data1_idx` (`owner_data_id`),
  KEY `registrar_data_id` (`registrar_data_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=209 ;

--
-- Дамп даних таблиці `resource`
--

INSERT INTO `resource` (`resource_id`, `name`, `class_id`, `coordinates`, `coords_center_lat`, `coords_center_lng`, `owner_data_id`, `reason`, `date`, `registrar_data_id`, `registration_number`) VALUES
(185, 'Сквер', 1, '[[49.837110740852815,24.012501686811447],[49.83668517739605,24.013724774122235],[49.8366609582249,24.013821333646774],[49.836650578576425,24.01390716433525],[49.83699310580031,24.014620631933212],[49.83704154379776,24.01465281844139],[49.83710036130087,24.01466891169548],[49.837169558271775,24.01466891169548],[49.837249134665896,24.01467427611351],[49.83731833142388,24.01467427611351],[49.83740136740278,24.01466891169548],[49.837487863062485,24.01465281844139],[49.83754668002271,24.014620631933212],[49.837619336168906,24.014561623334885],[49.83768507258808,24.014502614736557],[49.83772659028046,24.01440069079399],[49.837768107937194,24.014239758253098],[49.83778194714817,24.014111012220383],[49.83777502754318,24.01395007967949],[49.83775772852634,24.013842791318893],[49.83773005008655,24.01370331645012],[49.83763663523526,24.01346728205681],[49.83737368875899,24.012791365385056],[49.83718331656395,24.012319967150685]]', 49.8372, 24.0136, 166, '', '2015-11-10', 113, '804:23:17:026:0021'),
(186, 'пл. Св. Юри', 1, '[[49.83654497093241,24.013875648379326],[49.83655016076826,24.013964161276817],[49.83660897886909,24.01398293673992],[49.836629738181685,24.014007076621052],[49.83688749890436,24.014548882842064],[49.83694285673268,24.014674946665764],[49.83694631659485,24.014696404337883],[49.83694112680151,24.014725908637047],[49.836939396870285,24.014758095145226],[49.83693420707619,24.014801010489464],[49.83692728734987,24.014846608042717],[49.83691517782646,24.014884158968925],[49.83690306829999,24.014913663268086],[49.83695150638765,24.014951214194298],[49.8369688056929,24.014927074313164],[49.83699129478049,24.014913663268086],[49.83711065976259,24.01486001908779],[49.837169477181625,24.014849290251732],[49.83738744699307,24.014846608042717],[49.83745145381457,24.014841243624687],[49.83746875294097,24.014851972460747],[49.83756735784329,24.01501290500164],[49.8377023716309,24.015248268842697],[49.83774042950333,24.01518926024437],[49.83775080891789,24.01514634490013],[49.83774734911328,24.01494786143303],[49.83777848734581,24.014824479818344],[49.83783038435545,24.014604538679123],[49.83784768334628,24.014486521482468],[49.837861522534496,24.014347046613693],[49.83787536171876,24.01421293616295],[49.83787536171876,24.014094918966293],[49.83787882151418,24.01395007967949],[49.83789612048771,24.013821333646774],[49.83792025795133,24.01374153792858],[49.83795312596755,24.013674482703205],[49.838005022789744,24.013623520731926],[49.83803443096426,24.013575240969658],[49.838043080423965,24.01350550353527],[49.83806210922984,24.013339206576347],[49.83808113802824,24.01314340531826],[49.83812438526943,24.012733027338978],[49.83807248857535,24.012706205248833],[49.83805345977355,24.012837633490562],[49.838039620640274,24.01291809976101],[49.838029241287714,24.012947604060173],[49.83799464342976,24.01298515498638],[49.837624444800085,24.01287518441677],[49.837619255079524,24.012840315699577],[49.8376279046135,24.012805446982384],[49.83761233545125,24.01279203593731],[49.83761406535842,24.01274912059307],[49.83749124179605,24.012698158621788],[49.837461833291144,24.0126820653677],[49.837437614508985,24.01265524327755],[49.83729922123538,24.012285098433495],[49.83729057164262,24.012228772044182],[49.8372923015613,24.012086614966393],[49.83730614090846,24.011933729052544],[49.83720407562999,24.01190958917141],[49.83703973277977,24.012091979384422],[49.83709682035948,24.012242183089256],[49.83719196617589,24.012317284941673],[49.837382257247086,24.012837633490562],[49.837574277478005,24.013328477740288],[49.83768326159419,24.013596698641777],[49.83771612977149,24.013687893748283],[49.83774380821926,24.01375763118267],[49.837750727828734,24.0138354152441],[49.837755917535176,24.013923928141594],[49.83775937733915,24.0140151232481],[49.83775937733915,24.0140875428915],[49.83775245773092,24.014170691370964],[49.837738618511494,24.014253839850422],[49.83771785967493,24.014363810420036],[49.837697100829445,24.014422819018364],[49.83766596254453,24.014473780989647],[49.83763309433312,24.01451401412487],[49.837588116744485,24.01456229388714],[49.83753794938469,24.014610573649406],[49.8374895118845,24.01465080678463],[49.83742896494102,24.014666900038716],[49.8373476589262,24.01467762887478],[49.83727846221017,24.01468299329281],[49.83722310476606,24.014685675501823],[49.837153907871794,24.01468835771084],[49.83712276923705,24.01468835771084],[49.83707952110002,24.01468299329281],[49.83703800285206,24.014661535620686],[49.83699821449764,24.014626666903492],[49.83694804652584,24.014548882842064],[49.836859819966435,24.014345034956932],[49.836769863308746,24.014165326952934],[49.83669547594618,24.01400439441204],[49.836655687309936,24.013942703604698]]', 49.8372, 24.0136, 122, '', '2015-11-10', 113, '804:23:17:026:0022'),
(208, 'пл. Юри 8', 1, '[[49.837482673327266,24.012512415647507],[49.83747229385514,24.01272162795067],[49.83749651261995,24.012753814458847],[49.83758300810946,24.012780636548996],[49.8375855218823,24.012821540236473],[49.83762184993987,24.012832269072533],[49.83762357984671,24.012861773371696],[49.837649528441624,24.012872502207756],[49.83766163778115,24.012915417551994],[49.837993778483,24.0130066126585],[49.83801626709389,24.012993201613426],[49.83803183612605,24.012966379523277],[49.83803702580234,24.01292346417904],[49.83806297417537,24.012714251875877],[49.83767201721261,24.012574777007103],[49.83748691701703,24.0125023573637]]', 49.8378, 24.0128, NULL, 'паспорт громадянина України   ,виданий на ім''я     2015.11.11', '2015-11-11', 113, '804:23:17:026:0023');

-- --------------------------------------------------------

--
-- Структура таблиці `resource_attribute`
--

CREATE TABLE IF NOT EXISTS `resource_attribute` (
  `attribute_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  PRIMARY KEY (`attribute_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=8 ;

--
-- Дамп даних таблиці `resource_attribute`
--

INSERT INTO `resource_attribute` (`attribute_id`, `name`) VALUES
(1, 'length'),
(2, 'width'),
(3, 'height'),
(4, 'square'),
(5, 'volume'),
(6, 'weight'),
(7, 'perimeter');

-- --------------------------------------------------------

--
-- Структура таблиці `resource_class`
--

CREATE TABLE IF NOT EXISTS `resource_class` (
  `class_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  PRIMARY KEY (`class_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=11 ;

--
-- Дамп даних таблиці `resource_class`
--

INSERT INTO `resource_class` (`class_id`, `name`) VALUES
(1, 'земельні ресурси'),
(2, 'водні ресурси'),
(3, 'надра'),
(4, 'клімат'),
(5, 'повітряний простір'),
(6, 'атмосферні ресурси'),
(7, 'радіочастотний ресурс'),
(8, 'фауна '),
(9, 'флора '),
(10, 'альтернативні джерела енергії');

-- --------------------------------------------------------

--
-- Структура таблиці `role`
--

CREATE TABLE IF NOT EXISTS `role` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Дамп даних таблиці `role`
--

INSERT INTO `role` (`role_id`, `name`) VALUES
(1, 'user'),
(2, 'registrar'),
(3, 'admin'),
(4, 'commissioner');

-- --------------------------------------------------------

--
-- Структура таблиці `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `auth_key` varchar(32) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `password_reset_token` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `user_data_id` int(11) DEFAULT NULL,
  `role_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`),
  KEY `role_id` (`user_data_id`),
  KEY `role_id_2` (`role_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=39 ;

--
-- Дамп даних таблиці `user`
--

INSERT INTO `user` (`user_id`, `username`, `auth_key`, `password_hash`, `password_reset_token`, `email`, `user_data_id`, `role_id`) VALUES
(1, 'demo', 'mPLobHQJkMV7pdw6JM5azks9n-Fkx9EY', '$2y$13$BlX7rTSKcUaluomULVXgRec/1H.y2yJG.K7jSXZArCq4OkzhJ9S/y', NULL, 'demo@mail.net', 1, 3),
(3, 'mof', 'pdw6JM5azks9n-Fkx9EYmPLobHQJkMV7', '$2y$13$XSNOyLiil07pBhh5RnNsxuHsvr21cO3HoqGtMs9rPe4xGr2L.RdUu', 'F7NFSAPun1hooVGJGpUGgaUpPcJ4iEEu_1444824168', 'zhenyast@yandex.ru', 2, 2),
(7, 'mof2', 'sBZlLkpEbikELmURWCopgN-lYiqU7UYu', '$2y$13$yLUJbUf98IMuPBuGO2lkwu87KYF0lJM.q0s8cA2wvNxOyPCT1p/92', NULL, 'zhenyast@yandex.ru', 1, 3),
(8, 'mof23', 'LTrS-nd6GOp4NAuWsqLPMGRmTXyhnRoR', '$2y$13$Ttwe62ORjJUriGFQoT9jkeFwzaQjXlAMEmPtKiy7JYbbjEmCf09V2', NULL, 'test@gmail.com', 1, 1),
(9, 'mof234', 'v0HLQsttxqamwDDszxTmGrio0KjVFASu', '$2y$13$sVfWSaKYBjCXRG.ipdGnBOG7IWZ5epKuRxcj43I.5TLlWaxU1Tfiq', NULL, 'test@gmail.com', 1, 1),
(10, 'mof4', 'nzns3KZbmVNEERTeqbyWSmiA8iIsZCuy', '$2y$13$x4P0BcqVrFjVSE8tVfbaZuFEHpwX9Llt6MEDWtpT3H35m/35I7xhq', NULL, 'test@gmail.com', 1, 1),
(11, 'mof5', 'D3Hwd61ihElNoSZqYdbm6tY7MiR9TKMN', '$2y$13$apiaxjG5M3k1MQ/IdxYM1ubbyaOglIdNoOymvuzkITKShbqhP.EW6', NULL, 'test@gmail.com', 1, 1),
(12, 'mof6', 'FEdVtOX6YBUSBDkGwBmlkRs7MvKS1rNS', '$2y$13$UW1VZ9hHTX5Vhnzw.uoQ7OUMu/GInWxGUN8CKFqE11hHkyE0VQuxe', NULL, 'test@gmail.com', 1, 1),
(14, 'mof9', 'CnJoAGaGgNUzWFs1douSRUhI-7nCQofg', '$2y$13$NGtRJrUMsGHIrqrKdWq2kercGlmyyjwOgpm8ZxYfSey6Y0Gk0Dtfu', NULL, 'test@gmail.com', 1, 1),
(15, 'mof10', 'iWVndxR_sQaVRTNgvgKNsgLlJB1pNzDk', '$2y$13$GyFd0cLsWEqsoY31QSynBexJhzntmrB6yGu.Tk2kTsSsq09uybWwC', NULL, 'test@gmail.com', 2, 1),
(16, 'mof11', 'J9pL0T5YDbPSK7mn0O0FRYndbFFxAgEX', '$2y$13$O4Hid6PLW2BGi.Y4IlX2c.XBVWk.SPul8pWrD6XgYxxQgRXtRHdpC', NULL, 'test@gmail.com', 2, 1),
(17, 'mof12', '2b1-_u4Gb-BcDIlQTwwxOFSXypfeLuMP', '$2y$13$ffgOz/IhD8Jb2r0vX/Z44uA9u0QP2aRDlxdxokeVdK18z76yPo7RO', NULL, 'personalDataModel@ya.ru', 2, 1),
(18, 'mof17', 'ecuUkIjIbI-a_JL3dk5clnLTBu6NMPxm', '$2y$13$Wqc8FH7coO.n/iyc/l4nHecWTJlQQujSFcnBeX1n7MhwmcsvPZ00m', NULL, 'test@mail.ru', 2, 1),
(20, 'mof18', 'vLNM1wxWKgQN27Ggot6mt2i08QxEI1dk', '$2y$13$LcGAfRrqIZDUwtdECiOKreh5XUAL106odA5Zj89sd034r3WJxdvBe', NULL, 'vasya@ya.ru', 2, 1),
(21, 'test36', 'ucDnNXLbL4cqo6EEezyEeUoC37NuU47n', '$2y$13$g00nLVE8.hcc1yAXCJeO.uzaTouLi4QxGh0YSDP8WMFnxKovaMEWO', NULL, 'test36@mail.ru', 94, 1),
(22, 'test37', '0hRs_b4To10q9QejQ3wS0ATzNMUKmSHy', '$2y$13$27YSO6O3fFH62.S2hIPWHuwuYzVyMfLx1iVex.oB5oJKvrd2I.Gfa', NULL, 'test37@mail.ru', 97, 1),
(23, 'test38', 'eJWSGRi2nyz9wPviMJw0lH1ixy5IrtMi', '$2y$13$54dopM1dbO6totckC8dtF.akY7Wr6XBWBx47KFU/rUm2cjt6HvmSO', NULL, 'vitashev@bk.ru', 98, 1),
(24, 'test385', 'ODBf-XUPupYGk4iss935XhIECg-nbwok', '$2y$13$xaKAJKmtQveX.TAIYmBun.PY60neU.6v1cfKz2Ujq59B/Bne3ZE/G', NULL, 'rerse@ya.ri', 101, 1),
(25, 'user4', 'VYNlikVL5ZSiCPZp3XL6NZ_nr4cl9Pr3', '$2y$13$ZXQ6T/TwSILVwPqTvPU3.uour0NolMMiVxE0jtuXAknR9hW7jieue', NULL, 'registerresource@gmail.com', 107, 2),
(26, 'user5', 'AE5fW3PCbNY3D5jGAtAiAGXd0ezMdy-q', '$2y$13$KuiNKwLYUfFdmvzfDhrBiuhiPADovcohyE72peEoaven2EsohU2wK', NULL, 'registerresource@gmail.com', 108, 2),
(27, 'grgrgrt', 'Fxl0xfdMGVrzpPj8c1_uNtAwAAf5t90T', '$2y$13$pddF4JoxuVGVm.gVWl.KJ.HpBYzvE4s4Fbwv9CUJUqHUzMgu3gF8.', NULL, 'gtrgrt@ya.ru', 109, 2),
(28, 'username1', 'kq1OSpQweIhZ3kfF5f6fAM2_kM9H5h3E', '$2y$13$EDFwkXrlujw3YdzlOG708up.2piJ5aN8sduhaTKYF0tpeeFiQ2Iqu', NULL, 'registerresource@gmail.com', 112, 2),
(29, 'registrar', 'nh1R7g-MHLNcBOFuP_Jn8N0q_9E3K50z', '$2y$13$/qKMqvRxreJoaI2Zpqee2.TjYGI57vsSbkzGOAZSYUp.DyoerZrEO', NULL, 'test69@mail.ru', 113, 2),
(30, 'gith', 'r9ZSVEms7lozWO7Guo_K3ZiyaxRyQD3M', '$2y$13$/01guLVgaBoUExQTjJiCH.yOgoyIje7RWjsC3Iis1iQaevJxiEZMG', NULL, 'gith@gmail.com', 114, 2),
(31, 'first_commissioner', 'mPLobHQJkMV7pdw6JM5azks9n-Fkx9EY', '$2y$13$BlX7rTSKcUaluomULVXgRec/1H.y2yJG.K7jSXZArCq4OkzhJ9S/y', NULL, 'first_commissioner@mail.ru', 115, 4),
(38, 'second_commissioner', 'mPLobHQJkMV7pdw6JM5azks9n-Fkx9EY', '$2y$13$BlX7rTSKcUaluomULVXgRec/1H.y2yJG.K7jSXZArCq4OkzhJ9S/y', NULL, 'second_commissioner@mail.ru', 116, 4);

--
-- Обмеження зовнішнього ключа збережених таблиць
--

--
-- Обмеження зовнішнього ключа таблиці `attribute_class_view`
--
ALTER TABLE `attribute_class_view`
  ADD CONSTRAINT `fk_attribute_class_view_resource_attribute1` FOREIGN KEY (`attribute_id`) REFERENCES `resource_attribute` (`attribute_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_attribute_class_view_resource_class1` FOREIGN KEY (`class_id`) REFERENCES `resource_class` (`class_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Обмеження зовнішнього ключа таблиці `community`
--
ALTER TABLE `community`
  ADD CONSTRAINT `fk_community_user` FOREIGN KEY (`commissioner_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Обмеження зовнішнього ключа таблиці `membership`
--
ALTER TABLE `membership`
  ADD CONSTRAINT `fk_membership_community` FOREIGN KEY (`community_id`) REFERENCES `community` (`community_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_membership_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Обмеження зовнішнього ключа таблиці `operation`
--
ALTER TABLE `operation`
  ADD CONSTRAINT `fk_transactions_transaction_type1` FOREIGN KEY (`type_id`) REFERENCES `operation_type` (`type_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Обмеження зовнішнього ключа таблиці `parameter`
--
ALTER TABLE `parameter`
  ADD CONSTRAINT `fk_stats_resources1` FOREIGN KEY (`resource_id`) REFERENCES `resource` (`resource_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_stats_resource_attributes1` FOREIGN KEY (`attribute_id`) REFERENCES `resource_attribute` (`attribute_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Обмеження зовнішнього ключа таблиці `resource`
--
ALTER TABLE `resource`
  ADD CONSTRAINT `fk_resource_personal_data1` FOREIGN KEY (`owner_data_id`) REFERENCES `personal_data` (`personal_data_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_resource_resource_class1` FOREIGN KEY (`class_id`) REFERENCES `resource_class` (`class_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Обмеження зовнішнього ключа таблиці `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`user_data_id`) REFERENCES `personal_data` (`personal_data_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `user_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
