<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "operation".
 *
 * @property integer $operation_id
 * @property string $date
 * @property integer $type_id
 * @property integer $user_id
 * @property integer $resource_id
 * @property string $before_change
 *
 * @property Resource $resource
 * @property OperationType $type
 * @property User $user
 */
class Operation extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'operation';
    }
	public function fields()
    {
    	return [
				'operation_id',
				'date_log',
				'type' => function ($model) {
							    return $model->typeName->name;
    			},
                'user_id'
                ,
				'resource_name' => function ($model) {
										return $model->getResourceName($model->resource_id);
    			},
				'before_change',	
    	];
    }
    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['date_log', 'type_id', 'resource_id'], 'required'],
            [['date_log'], 'safe'],
            [['type_id', 'user_id', 'resource_id'], 'integer'],
            [['before_change'], 'string']
        ];
    }
    /**
     * @inheritdoc
     */
	private function getResourceName($id)
	{
		return Resource::find()
		->where(['resource_id' => $id])
		->asArray()->one()['name'];
	}

    public function attributeLabels()
    {
        return [
            'operation_id' => 'Operation ID',
            'date_log' => 'Date',
            'type_id' => 'Type ID',
            'user_id' => 'User ID',
            'resource_id' => 'Resource ID',
            'before_change' => 'Before Change',
        ];
    }
    /**
     * @return \yii\db\ActiveQuery
     */
    public function getResource()
    {
		return $this->hasOne(Resource::className(), ['resource_id' => 'resource_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getTypeName()
    {
        return $this->hasOne(OperationType::className(), ['type_id' => 'type_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getUser()
    {
        return $this->hasOne(User::className(), ['user_id' => 'user_id']);
    }
}
