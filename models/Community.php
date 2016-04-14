<?php
namespace app\models;
use yii\db\ActiveRecord;
class Community extends ActiveRecord
{
	public static function tableName()
	{
		return 'community';
	}
	public function attributeLabels()
	{
		return [
			'community_id' => 'Community ID',
			'name' => 'Name',
			'prefix' => 'Prefix',
			'commissioner_id' => 'Commissioner ID',
			'notes' => 'Notes'
		];
	}
	public function getUsers()
	{
		return $this->hasOne(User::className(), ['user_id' => 'commissioner_id']);
	}
}