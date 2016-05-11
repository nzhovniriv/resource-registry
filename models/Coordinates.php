<?php
namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class Coordinates extends ActiveRecord
{
	public static function tableName(){
		return 'coordinates';
	}
}
?>