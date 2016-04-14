<?php
namespace app\controllers;

use yii\rest\ActiveController;
use yii\data\ActiveDataProvider;

class OperationController extends ActiveController
{
    public $modelClass = 'app\models\Operation';
	public $serializer = [ 'class' => 'yii\rest\Serializer', 'collectionEnvelope' => 'items'];
    
    public function behaviors()
    {
        return 
        \yii\helpers\ArrayHelper::merge(parent::behaviors(), [
            'corsFilter' => [
                'class' => \yii\filters\Cors::className(),
            ],
        ]);
    }
	function getValues($input){
			$result = explode(',', $input);
			if (array_sum($result) === 0)
				$result = '';
			return $result;
	}
	function getValue($input, $index){
			$values = explode('to', $input);				
			return $values[$index - 1];
	}
	public function actionSearch()
	{
		/*
		[type] => 1,2,3,4
		[name] => PARK
		[date] => 2000to4000
		*/
		
		//echo "<pre>";
		//print_r(\Yii::$app->request->get());
		
		$request= \Yii::$app->request->get();
		$model = new $this->modelClass;
		$query = $model::find()
								 ->select('*')
								 ->joinWith(['resource' => function ($q) use (&$request){
								   			$q->select('resource_id');
											$q->andFilterWhere(['like', 'resource.name', $request['name']]);
									}				  								    
								 ]);
								 
							 
		$query->andFilterWhere(['type_id' => $this->getValues($request['type'])]);
		$query->andFilterWhere([
								'and',
								['>=', 'date_log', $this->getValue($request['date_log'], 1)],
								['<=', 'date_log', $this->getValue($request['date_log'], 2)],
								]);
		
		$dataProvider = new ActiveDataProvider([
			'query' => $query,
			'pagination' => [
				'pageSize' => 4,
				'pageParam' => 'page',
			],
		]);

		return $dataProvider;
	}
}