<?php
namespace app\controllers;

use yii\rest\ActiveController;
use yii\data\ActiveDataProvider;

class AppController extends ActiveController {
	public $serializer = [ 'class' => 'yii\rest\Serializer', 'collectionEnvelope' => 'items'];

	public static function buildPagination ($query, $pageSize = 20, $pageParam = 'page') {
		$dataProvider = new ActiveDataProvider([
			'query' => $query,
			'pagination' => [
				'pageSize' => $pageSize,
				'pageParam' => $pageParam,
			],
		]);
		return $dataProvider;
	}
}

?>