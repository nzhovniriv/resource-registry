<?php
namespace app\controllers;

use app\controllers\AppController;
use app\models\User;
use app\models\Community;

class CommunityController extends AppController
{
	public $modelClass = 'app\models\Community';
	
	public function actionShow()
	{
		$request= \Yii::$app->request->get();
		$community = Community::find();
		
		if(isset($request['value'])){
			$community->select(['name', 'prefix', 'notes'])
            ->andFilterWhere(['like', 'name', $request['value']])
            ->orderBy('name')
            ->asArray();	
		}else{
			$community->select(['name', 'prefix', 'notes'])
            ->orderBy('name')
			->asArray();
		}

        return self::buildPagination($community);
	}

	public function actionAddcomm()
    {
        // add Community controller
        if (!$post = \Yii::$app->getRequest()->getBodyParams()) {
            throw new \yii\web\HttpException(400, 'Дані не отримані');
        }
        $communityModel = new Community();
        if ($communityModel->findByCommunityName($post['community_name'])){
            throw new \yii\web\HttpException(400, 'Користувач з таким логіном уже існує');
        }
        $transaction = \Yii::$app->db->beginTransaction();
        try {
            $communityModel = new Community();
            $communityModel->name = $post['community_name'];
            $communityModel->prefix = $post['community_num'];
            $communityModel->commissioner_id = (int)$post['commissioner_id'];
            $communityModel->notes = $post['community_additions'];
            if (!$communityModel->save()){
                foreach($communityModel->errors as $key){
                    $errorMessage .= $key[0];
                }
                throw new \yii\web\HttpException(422,$errorMessage);
            }
            $transaction->commit();
            $userModel = User::findUserById($post['commissioner_id']);
            $userModel->role_id = 4;
            $userModel->community_id = $communityModel->community_id;
            $userModel->save();
            // Add validation for data here
    
            return 'true';
            
        } catch (Exception $e) {
            $transaction->rollBack();
            throw new \yii\web\HttpException(422,$errorMessage . $error);
            return $errorMessage . $error;
        }
        exit('end');
    }
}