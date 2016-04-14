<?php
namespace app\controllers;

use yii\base\Exception;
use yii\rest\ActiveController;
use app\models\User;
use app\models\LoginForm;
use app\models\Role;
use app\models\PersonalData;
use yii\web\Session;

class UserController extends ActiveController
{
    public $modelClass = 'app\models\User';

    public function actionLogin()
    {
        $modelLoginFrom = new LoginForm();







        if ($modelLoginFrom->load(\Yii::$app->getRequest()->getBodyParams(), '') && $modelLoginFrom->login()) {
            $post = \Yii::$app->getRequest()->getBodyParams();

            $modelUser = new User();

            $modelRole = new Role();
            $result = $modelRole->find()
                ->where(['=','role_id', \Yii::$app->user->identity->getRole()]
                )->all();
            $resultuserdata = $modelUser->find()
                ->where(['=','username', $post['username']]
                )->one();
            $session = new Session();
            $session->open();
            $session->set('role', $result[0]->name);
            $session->close();
            return [
                'username' => $post['username'],
                'role' => $result[0]->name,
                'isLogined' => true,
                'userDataID' => $resultuserdata->user_data_id
            ];
        } else {
            return $modelLoginFrom;
        }
    }
    public function actionAdduser()
    {
 /*       echo \Yii::$app->basePath;
        echo \Yii::$app->session->get('role');
        exit('1');*/
        if (!$post = \Yii::$app->getRequest()->getBodyParams()) {
            throw new \yii\web\HttpException(400, 'Дані не отримані');
        }
        $userModel = new User();
        if ($userModel->findByUsername($post['username'])){
            throw new \yii\web\HttpException(400, 'Користувач з таким логіном уже існує');
        }
        $transaction = \Yii::$app->db->beginTransaction();
        try {
            $personalDataModel = new PersonalData();
            $personalDataModel->last_name = $post['last_name'];
            $personalDataModel->first_name = $post['first_name'];
            $personalDataModel->middle_name = $post['middle_name'];
            $personalDataModel->passport_series = $post['passport_series'];
            $personalDataModel->passport_number = $post['passport_number'];
            $personalDataModel->address = $post['address'];
            if (!$personalDataModel->save()){
                foreach($personalDataModel->errors as $key){
                    $errorMessage .= $key[0];
                }
                throw new \yii\web\HttpException(422,$errorMessage);
            }
            $userModel = new User();
            $userModel->username = $post['username'];
            $password = $post['password'];
            $validator = new \yii\validators\StringValidator([
                'min' => 3,
                'max' => 12,
                'tooShort' => 'Пароль повинен містити мінімум {min, number} символи',
                'tooLong' => 'Пароль повинен містити не більше {max, number} символів'
            ]);
            if (!$validator->validate($password, $error)) {
                throw new \yii\web\HttpException(422, $error);
            }
            $userModel->setPassword($post['password']);
            $userModel->email = $post['email'];
            $userModel->role_id = 2;
            $userModel->user_data_id = $personalDataModel->personal_data_id;
            $userModel->generateAuthKey();
            if (!$userModel->save()){
                foreach($userModel->errors as $key){
                    $errorMessage .= $key[0];
                }
                throw new \yii\web\HttpException(422,$errorMessage);
            }
            $transaction->commit();
        } catch (Exception $e) {
            $transaction->rollBack();
            throw new \yii\web\HttpException(422,$errorMessage . $error);
            return $errorMessage . $error;
        }
        exit('end');
    }
    public function actionRestorepass(){
        if (!$post = \Yii::$app->getRequest()->getBodyParams()) {
            throw new \yii\web\HttpException(400, 'Дані не отримані');
        }
        $model = User::findByUsername($post['username']);
        if (!$model->username){
            throw new \yii\web\HttpException(400, 'Даного користувача не існує');
        }

        $model->generatePasswordResetToken();
        $url = 'http://resource/site/restorepassword?u=' . $model->username . '&p=' . $model->password_reset_token;
        \Yii::$app->mailer->compose()
            ->setFrom('localhost@gmail.com')
            ->setTo($model->email)
            ->setSubject('Відновлення паролю')
            ->setTextBody('')
            ->setHtmlBody("<b><a href=\"$url\">$url</a></b>")
            ->send();
        $model->save();
        return true;
    }
    public function actionChangepass(){
/*        echo \Yii::$app->session->get('role');
        exit('d');*/
        if (!$post = \Yii::$app->getRequest()->getBodyParams()) {
            throw new \yii\web\HttpException(400, 'Дані не отримані');
        }
        $model = User::findByPasswordResetToken($post['token']);
        if (!$model) {
            throw new \yii\web\HttpException(422, 'Ключ для відновлення паролю не є коректним');
        }
        $password = $post['password'];
        $validator = new \yii\validators\StringValidator([
            'min' => 3,
            'max' => 12,
            'tooShort' => 'Пароль повинен містити мінімум {min, number} символи',
            'tooLong' => 'Пароль повинен містити не більше {max, number} символів'
        ]);
        if (!$validator->validate($password, $error)) {
            throw new \yii\web\HttpException(422, $error);
        }
        $model->setPassword($password);
        $model->removePasswordResetToken();
        $model->save();
        echo $model->username;
        exit('ok');
    }
    public function actionLogout(){
        \Yii::$app->session->get('role');
        \Yii::$app->session->destroy();
        return 'Вихід здійснено';
    }
}