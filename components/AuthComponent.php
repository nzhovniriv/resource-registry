<?php
namespace app\components;

use Yii;
use yii\base\Component;

class AuthComponent extends Component
{
    private $auth = [
        'registrar' => [
            'index',
            'view',
            'create',
            'update',
            'delete'
            ],
        'admin' => [
            'index',
            'view',
            'create',
            'update',
            'delete'
            ],
    ];
    private $readPrivateData = [
        'registrar',
        'admin'
    ];
    public $read = [
            'index',
            'view'
        ];
    public $write= [
        'create',
        'update',
        'delete'
    ];
    public function checkPermissions($action, $permission)
    {
        $searchAction = array_search($action, $permission);
        if ($searchAction !== false) {
            $role = \Yii::$app->session->get('role');
            if (!$role) {
                throw new \yii\web\ForbiddenHttpException('У вас немає прав на дану операцію');
            }
            $search = array_search($action, $this->auth[$role]);
            if ($search !== false) {
                //exit('good');
                return true;
            } else {
                throw new \yii\web\ForbiddenHttpException('У вас немає прав на дану операцію');
            }
        }
        return true;
    }
    public function checkPermissionsPrivateData($action, $permission)
    {
        $searchAction = array_search($action, $permission);
        if ($searchAction !== false) {
            $role = \Yii::$app->session->get('role');
            if (!$role) {
                throw new \yii\web\ForbiddenHttpException('У вас немає прав на дану операцію');
            }
            $search = array_search($role, $this->readPrivateData);
            if ($search !== false) {
                //exit('goodR');
                return true;
            } else {
                throw new \yii\web\ForbiddenHttpException('У вас немає прав на дану операцію');
            }
        }
        return true;
    }
}
