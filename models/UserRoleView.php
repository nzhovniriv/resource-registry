<?php

namespace app\models;

use Yii;

class UserRoleView extends \yii\db\ActiveRecord{
    public static function tableName(){
        return 'user_role_view';
    }
    public function rules(){
        return [
            [['role_id', 'user_id'], 'required'],
            [['role_id', 'user_id'], 'integer']
        ];
    }
    public function attributeLabels(){
        return [
            'view_id' => 'View ID',
            'role_id' => 'Role ID',
            'user_id' => 'User ID',
        ];
    }
    public function getRole(){
        return $this->hasOne(Role::className(), ['role_id' => 'role_id']);
    }
    public function getUser(){
        return $this->hasOne(User::className(), ['user_id' => 'user_id']);
    }
	public function getRoleName($roleId){
		return Role::findOne($roleId)->name;
	}
}
