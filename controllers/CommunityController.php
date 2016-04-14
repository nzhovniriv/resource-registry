<?php
namespace app\controllers;

use yii\rest\ActiveController;
use yii\data\ActiveDataProvider;
use app\models\Community;

class CommunityController extends ActiveController
{
	public $modelClass = 'app\models\Community';
	public $serializer = [ 'class' => 'yii\rest\Serializer', 'collectionEnvelope' => 'items'];
	public function actionShow()
	{
		$request= \Yii::$app->request->get();
		
		$community = Community::find()
		->select(['name', 'prefix', 'username'])
		->innerJoinWith('users')
		->andFilterWhere(['like', 'name', $request['value']])
		->asArray();

		$dataProvider = new ActiveDataProvider([
			'query' => $community,
			'pagination' => [
				'pageSize' => 20,
				'pageParam' => 'page'

			],
		]);
		return $dataProvider;
	}
}