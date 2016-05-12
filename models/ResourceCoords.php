<?php
namespace app\models;
use yii\db\ActiveRecord;
class Community extends ActiveRecord
{
	public static function tableName()
	{
		return 'resource_coords';
	}
}